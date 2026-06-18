#!/bin/bash
# Local Business Site — Page Validator v1 (garde-fou 2)
# Version GENERIQUE adaptee de DRM validate-page.sh
#
# Usage: bash validate-page.sh <url> <page_type> [--telephone "..."] [--ville "..."] [--secteur "..."]
#
# page_type: homepage | service | product | zone | contact | static
#
# Returns: PASS or FAIL with detailed reasons
# FAIL = do NOT proceed to the next page

set -uo pipefail

URL=$1
PAGE_TYPE=${2:-"service"}
shift 2 || true

TELEPHONE=""
VILLE=""
SECTEUR=""
while [[ $# -gt 0 ]]; do
  case $1 in
    --telephone) TELEPHONE="$2"; shift 2 ;;
    --ville) VILLE="$2"; shift 2 ;;
    --secteur) SECTEUR="$2"; shift 2 ;;
    *) shift ;;
  esac
done

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

FAILS=0
WARNINGS=0

fail() { echo -e "${RED}FAIL${NC}: $1"; FAILS=$((FAILS + 1)); }
warn() { echo -e "${YELLOW}WARN${NC}: $1"; WARNINGS=$((WARNINGS + 1)); }
pass() { echo -e "${GREEN}PASS${NC}: $1"; }

gcount() { grep -ci "$1" 2>/dev/null || echo "0"; }
gocount() { grep -oi "$1" 2>/dev/null | wc -l | tr -d ' '; }

echo "============================================"
echo "Local Business Page Validator v1 — $PAGE_TYPE"
echo "URL: $URL"
echo "============================================"
echo ""

# Fetch
HTTP_CODE=$(curl -s -o /tmp/lb-validate-page.html -w "%{http_code}" "$URL")
if [ "$HTTP_CODE" != "200" ]; then
  fail "HTTP status $HTTP_CODE (expected 200)"
  echo -e "\n${RED}RESULT: FAIL${NC} ($FAILS fails)"
  exit 1
fi

HTML=$(cat /tmp/lb-validate-page.html)

# ========================================
# CHECK 1: Word count
# ========================================
WORD_COUNT=$(echo "$HTML" | python3 -c "
import sys, re
html = sys.stdin.read()
text = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL)
text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL)
text = re.sub(r'<[^>]+>', ' ', text)
text = re.sub(r'\s+', ' ', text).strip()
print(len([w for w in text.split() if len(w) > 1]))
" 2>/dev/null || echo "0")

case $PAGE_TYPE in
  homepage) MIN_WORDS=1000 ;; service) MIN_WORDS=700 ;; product) MIN_WORDS=700 ;; zone) MIN_WORDS=500 ;;
  contact) MIN_WORDS=200 ;; *) MIN_WORDS=100 ;;
esac

if [ "$WORD_COUNT" -lt "$MIN_WORDS" ]; then
  fail "Word count: $WORD_COUNT (min $MIN_WORDS for $PAGE_TYPE)"
else
  pass "Word count: $WORD_COUNT (min $MIN_WORDS)"
fi

# ========================================
# CHECK 2: Image count + alt text + title
# ========================================
IMG_COUNT=$(echo "$HTML" | gocount '<img ')
IMG_SEO=$(echo "$HTML" | python3 << 'PYEOF'
import sys, re
html = sys.stdin.read()
imgs = re.findall(r'<img [^>]*?/?>', html, re.IGNORECASE)
total = len(imgs)
no_alt = 0
empty_alt = 0
no_title = 0
for img in imgs:
    low = img.lower()
    if 'alt=' not in low:
        no_alt += 1
    elif 'alt=""' in low or "alt=''" in low:
        empty_alt += 1
    if 'title=' not in low:
        no_title += 1
print(f'{total}|{no_alt}|{empty_alt}|{no_title}')
PYEOF
)
IMG_SEO=${IMG_SEO:-"0|0|0|0"}

IMG_NO_ALT=$(echo "$IMG_SEO" | cut -d'|' -f2)
IMG_EMPTY_ALT=$(echo "$IMG_SEO" | cut -d'|' -f3)
IMG_NO_TITLE=$(echo "$IMG_SEO" | cut -d'|' -f4)

case $PAGE_TYPE in
  homepage) MIN_IMGS=5 ;; service) MIN_IMGS=3 ;; product) MIN_IMGS=3 ;; zone) MIN_IMGS=2 ;;
  *) MIN_IMGS=0 ;;
esac

if [ "$IMG_COUNT" -lt "$MIN_IMGS" ]; then
  fail "Images: $IMG_COUNT <img> tags (min $MIN_IMGS for $PAGE_TYPE)"
else
  pass "Images: $IMG_COUNT (min $MIN_IMGS)"
fi

if [ "$IMG_NO_ALT" -gt 0 ]; then
  fail "Images WITHOUT alt attribute: $IMG_NO_ALT (every img MUST have alt for SEO)"
elif [ "$IMG_EMPTY_ALT" -gt 0 ]; then
  fail "Images with EMPTY alt=\"\": $IMG_EMPTY_ALT (alt must contain keyword + ville)"
else
  pass "All images have alt text"
fi

if [ "$IMG_NO_TITLE" -gt 0 ] && [ "$IMG_COUNT" -gt 0 ]; then
  fail "Images WITHOUT title attribute: $IMG_NO_TITLE (every img MUST have title for SEO)"
else
  if [ "$IMG_COUNT" -gt 0 ]; then
    pass "All images have title text"
  fi
fi

# ========================================
# CHECK 3: Section count
# ========================================
SECTION_COUNT=$(echo "$HTML" | gocount '<section')

case $PAGE_TYPE in
  homepage) MIN_SECTIONS=10 ;; service) MIN_SECTIONS=7 ;; product) MIN_SECTIONS=7 ;; zone) MIN_SECTIONS=5 ;;
  *) MIN_SECTIONS=2 ;;
esac

if [ "$SECTION_COUNT" -lt "$MIN_SECTIONS" ]; then
  fail "Sections: $SECTION_COUNT (min $MIN_SECTIONS for $PAGE_TYPE)"
else
  pass "Sections: $SECTION_COUNT (min $MIN_SECTIONS)"
fi

# ========================================
# CHECK 4: H2 count
# ========================================
H2_COUNT=$(echo "$HTML" | gocount '<h2')

case $PAGE_TYPE in
  homepage) MIN_H2=6 ;; service) MIN_H2=4 ;; product) MIN_H2=4 ;; zone) MIN_H2=3 ;; *) MIN_H2=1 ;;
esac

if [ "$H2_COUNT" -lt "$MIN_H2" ]; then
  fail "H2 headings: $H2_COUNT (min $MIN_H2 for $PAGE_TYPE)"
else
  pass "H2 headings: $H2_COUNT (min $MIN_H2)"
fi

# ========================================
# CHECK 5: Placeholder grey boxes
# ========================================
GREY_COUNT=$(echo "$HTML" | python3 -c "
import sys, re
html = sys.stdin.read()
patterns = [
    r'rgba\(255,255,255,0\.08\)',
    r'rgba\(28,37,65,0\.06\)',
    r'#D1D5DB',
    r'rgb\(209,\s*213,\s*219\)',
    r'bg-gray-200',
    r'bg-gray-300',
]
count = 0
for p in patterns:
    count += len(re.findall(p, html))
print(count)
" 2>/dev/null || echo "0")

if [ "$GREY_COUNT" -gt 5 ]; then
  fail "Placeholder grey boxes: $GREY_COUNT patterns detected (max 5)"
elif [ "$GREY_COUNT" -gt 2 ]; then
  warn "Possible placeholder divs: $GREY_COUNT (visual check needed)"
else
  pass "Placeholder check: $GREY_COUNT patterns"
fi

# ========================================
# CHECK 6: Template variables (unreplaced)
# ========================================
TEMPLATE_VARS=$(echo "$HTML" | python3 -c "
import sys, re
html = sys.stdin.read()
text = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL)
vars_found = re.findall(r'\{(zone|phone|name|city|email|postalCode|domain|address|department|experience|delai|rating|interventions|secteur|service|ville|telephone|entreprise|nom_entreprise)\}', text)
print(len(vars_found))
" 2>/dev/null || echo "0")

if [ "$TEMPLATE_VARS" -gt 0 ]; then
  fail "Template variables found: $TEMPLATE_VARS (must be 0)"
else
  pass "Template variables: 0"
fi

# ========================================
# CHECK 7: Phone presence
# ========================================
if [ -n "$TELEPHONE" ]; then
  PHONE_COUNT=$(echo "$HTML" | gocount "$TELEPHONE")
  if [ "$PHONE_COUNT" -lt 3 ]; then
    fail "Phone '$TELEPHONE' appears $PHONE_COUNT times (min 3)"
  else
    pass "Phone present: $PHONE_COUNT times"
  fi
fi

# ========================================
# CHECK 8: FAQ "Qui appeler/contacter" (service + product pages)
# ========================================
if [ "$PAGE_TYPE" = "service" ]; then
  QUI_APPELER=$(echo "$HTML" | gocount "qui appeler\|qui contacter")
  if [ "$QUI_APPELER" -lt 1 ]; then
    fail "FAQ missing 'Qui appeler pour...' question (required for service pages)"
  else
    pass "FAQ 'Qui appeler' present"
  fi
fi
if [ "$PAGE_TYPE" = "product" ]; then
  QUI_APPELER=$(echo "$HTML" | gocount "qui appeler\|qui contacter\|quel est le prix\|combien coute\|comment choisir")
  if [ "$QUI_APPELER" -lt 1 ]; then
    warn "FAQ missing 'Qui appeler/Quel prix/Comment choisir' question (recommended for product pages)"
  else
    pass "FAQ lead question present"
  fi
fi

# ========================================
# CHECK 9: Internal links / maillage (service + product)
# ========================================
if [ "$PAGE_TYPE" = "service" ] || [ "$PAGE_TYPE" = "product" ]; then
  # Count internal links (href starting with / but not /# or external)
  MAILLAGE=$(echo "$HTML" | python3 -c "
import sys, re
html = sys.stdin.read()
links = re.findall(r'href=[\"\\x27](/[^\"\\x27#][^\"\\x27]*)[\"\\x27]', html)
unique = set(links)
print(len(unique))
" 2>/dev/null || echo "0")
  if [ "$MAILLAGE" -lt 6 ]; then
    fail "Maillage: only $MAILLAGE unique internal links (min 6 for $PAGE_TYPE — must link to other services + zones)"
  else
    pass "Maillage: $MAILLAGE unique internal links"
  fi
fi

# ========================================
# CHECK 10: Responsive / mobile
# ========================================
HAS_VIEWPORT=$(echo "$HTML" | gcount 'viewport')
if [ "$HAS_VIEWPORT" -lt 1 ]; then
  fail "Missing <meta name='viewport'> — mobile rendering broken"
else
  pass "Viewport meta present"
fi

HAS_RESPONSIVE=$(echo "$HTML" | grep -ci 'flex-wrap\|flexWrap\|@media\|max-width.*768\|max-width.*640\|md:\|lg:\|sm:' || true)
HAS_RESPONSIVE=${HAS_RESPONSIVE:-0}
if [ "$PAGE_TYPE" = "homepage" ] || [ "$PAGE_TYPE" = "service" ] || [ "$PAGE_TYPE" = "product" ]; then
  if [ "$HAS_RESPONSIVE" -lt 1 ]; then
    fail "No responsive patterns found (no flex-wrap, no @media, no Tailwind breakpoints) — NOT mobile-friendly"
  else
    pass "Responsive patterns detected ($HAS_RESPONSIVE)"
  fi
fi

# ========================================
# CHECK 11: Schema.org LocalBusiness (homepage)
# ========================================
if [ "$PAGE_TYPE" = "homepage" ]; then
  SCHEMA=$(echo "$HTML" | gcount 'LocalBusiness')
  if [ "$SCHEMA" -lt 1 ]; then
    fail "Schema.org LocalBusiness not found in homepage"
  else
    pass "Schema.org LocalBusiness present"
  fi
fi

# ========================================
# CHECK 12: Schema.org Service or Product (service/product pages)
# ========================================
if [ "$PAGE_TYPE" = "service" ]; then
  SCHEMA_SVC=$(echo "$HTML" | gcount '"Service"\|"@type":"Service"\|"@type": "Service"')
  if [ "$SCHEMA_SVC" -lt 1 ]; then
    fail "Schema.org Service not found on service page"
  else
    pass "Schema.org Service present"
  fi
fi

if [ "$PAGE_TYPE" = "product" ]; then
  SCHEMA_PROD=$(echo "$HTML" | gcount '"Product"\|"@type":"Product"\|"@type": "Product"')
  if [ "$SCHEMA_PROD" -lt 1 ]; then
    fail "Schema.org Product not found on product page"
  else
    pass "Schema.org Product present"
  fi
fi

# ========================================
# CHECK 13: Schema.org FAQPage (service + product)
# ========================================
if [ "$PAGE_TYPE" = "service" ] || [ "$PAGE_TYPE" = "product" ]; then
  SCHEMA_FAQ=$(echo "$HTML" | gcount 'FAQPage')
  if [ "$SCHEMA_FAQ" -lt 1 ]; then
    fail "Schema.org FAQPage not found (required on service/product pages)"
  else
    pass "Schema.org FAQPage present"
  fi
fi

# ========================================
# CHECK 14: Ville name present
# ========================================
if [ -n "$VILLE" ]; then
  VILLE_COUNT=$(echo "$HTML" | gocount "$VILLE")
  if [ "$VILLE_COUNT" -lt 3 ]; then
    fail "Ville '$VILLE' appears $VILLE_COUNT times (min 3)"
  else
    pass "Ville present: $VILLE_COUNT times"
  fi
fi

# ========================================
# CHECK 15: Secteur name present (service + homepage)
# ========================================
if [ -n "$SECTEUR" ]; then
  if [ "$PAGE_TYPE" = "homepage" ] || [ "$PAGE_TYPE" = "service" ] || [ "$PAGE_TYPE" = "product" ]; then
    SECTEUR_COUNT=$(echo "$HTML" | gocount "$SECTEUR")
    if [ "$SECTEUR_COUNT" -lt 2 ]; then
      fail "Secteur '$SECTEUR' appears $SECTEUR_COUNT times (min 2)"
    else
      pass "Secteur present: $SECTEUR_COUNT times"
    fi
  fi
fi

# ========================================
# CHECK 16: Title tag
# ========================================
TITLE=$(echo "$HTML" | python3 -c "
import sys, re
html = sys.stdin.read()
m = re.search(r'<title[^>]*>(.*?)</title>', html, re.DOTALL)
print(m.group(1).strip() if m else '')
" 2>/dev/null || echo "")

if [ -z "$TITLE" ]; then
  fail "No <title> tag found"
else
  TITLE_LEN=${#TITLE}
  if [ "$TITLE_LEN" -lt 30 ]; then
    warn "Title too short: '$TITLE' ($TITLE_LEN chars, recommend 45-65)"
  elif [ "$TITLE_LEN" -gt 70 ]; then
    warn "Title too long: $TITLE_LEN chars (recommend 45-65)"
  else
    pass "Title: '$TITLE' ($TITLE_LEN chars)"
  fi
fi

# ========================================
# CHECK 17: Meta description
# ========================================
META_DESC=$(echo "$HTML" | python3 -c "
import sys, re
html = sys.stdin.read()
m = re.search(r'<meta\s+name=[\"']description[\"']\s+content=[\"'](.*?)[\"']', html, re.DOTALL)
print(m.group(1).strip() if m else '')
" 2>/dev/null || echo "")

if [ -z "$META_DESC" ]; then
  warn "No meta description found"
else
  DESC_LEN=${#META_DESC}
  if [ "$DESC_LEN" -lt 80 ]; then
    warn "Meta description too short: $DESC_LEN chars (recommend 120-155)"
  else
    pass "Meta description: $DESC_LEN chars"
  fi
fi

# ========================================
# CHECK 18: Exactly 1 H1 per page
# ========================================
H1_COUNT=$(echo "$HTML" | gocount '<h1')
if [ "$H1_COUNT" -eq 0 ]; then
  fail "No H1 tag found (must have exactly 1)"
elif [ "$H1_COUNT" -gt 1 ]; then
  fail "Multiple H1 tags: $H1_COUNT (must have exactly 1)"
else
  pass "H1 count: 1"
fi

# ========================================
# CHECK 19: Canonical URL
# ========================================
HAS_CANONICAL=$(echo "$HTML" | gcount 'rel="canonical"\|rel=.canonical.')
if [ "$HAS_CANONICAL" -lt 1 ]; then
  fail "No <link rel='canonical'> found (critical for SEO)"
else
  pass "Canonical URL present"
fi

# ========================================
# CHECK 19b: Meta geo tags (local SEO signals)
# ========================================
HAS_GEO_REGION=$(echo "$HTML" | gcount 'name="geo.region"\|name=.geo\.region.')
HAS_GEO_PLACENAME=$(echo "$HTML" | gcount 'name="geo.placename"\|name=.geo\.placename.')
HAS_GEO_POSITION=$(echo "$HTML" | gcount 'name="geo.position"\|name=.ICBM.')
GEO_TOTAL=$((HAS_GEO_REGION + HAS_GEO_PLACENAME + HAS_GEO_POSITION))
if [ "$GEO_TOTAL" -lt 2 ]; then
  warn "Meta geo incomplete (region=$HAS_GEO_REGION placename=$HAS_GEO_PLACENAME position/ICBM=$HAS_GEO_POSITION). Ajouter dans layout.tsx."
else
  pass "Meta geo tags: $GEO_TOTAL/3"
fi

# ========================================
# CHECK 19c: og:image + og:title (social preview)
# ========================================
HAS_OG_IMAGE=$(echo "$HTML" | gcount 'property="og:image"\|property=.og:image.')
HAS_OG_TITLE=$(echo "$HTML" | gcount 'property="og:title"\|property=.og:title.')
if [ "$HAS_OG_IMAGE" -lt 1 ]; then
  fail "og:image missing (social preview broken)"
else
  pass "og:image present"
fi
if [ "$HAS_OG_TITLE" -lt 1 ]; then
  warn "og:title missing"
fi

# ========================================
# CHECK 20: Phone as tel: link (clickable)
# ========================================
if [ -n "$TELEPHONE" ]; then
  TEL_LINK=$(echo "$HTML" | gocount 'href="tel:')
  if [ "$TEL_LINK" -lt 2 ]; then
    fail "Phone tel: links: $TEL_LINK (min 2 — phone must be clickable)"
  else
    pass "Phone tel: links: $TEL_LINK"
  fi
fi

# ========================================
# CHECK 21: FAQ count (service + product)
# ========================================
if [ "$PAGE_TYPE" = "service" ] || [ "$PAGE_TYPE" = "product" ]; then
  FAQ_COUNT=$(echo "$HTML" | python3 -c "
import sys, re
html = sys.stdin.read()
# Count FAQ questions (typically in dt, or Question schema, or accordion items)
q1 = len(re.findall(r'<dt', html, re.I))
q2 = len(re.findall(r'\"@type\":\s*\"Question\"', html))
q3 = len(re.findall(r'itemtype.*Question', html, re.I))
print(max(q1, q2, q3))
" 2>/dev/null || echo "0")
  if [ "$FAQ_COUNT" -lt 5 ]; then
    fail "FAQ questions: $FAQ_COUNT (min 5 for $PAGE_TYPE)"
  else
    pass "FAQ questions: $FAQ_COUNT"
  fi
fi

# ========================================
# CHECK 22: Zones d'intervention section (service + product)
# ========================================
if [ "$PAGE_TYPE" = "service" ] || [ "$PAGE_TYPE" = "product" ]; then
  ZONES_SECTION=$(echo "$HTML" | gcount "zone.*intervention\|intervention.*zone\|nous intervenons\|secteur.*intervention")
  ZONES_LINKS=$(echo "$HTML" | python3 -c "
import sys, re
html = sys.stdin.read()
# Count links that look like zone pages (contain a city/area name pattern)
zone_links = re.findall(r'href=[\"'](/[^\"']*(?:zone|quartier|arrondissement|commune)[^\"']*)[\"']', html)
if not zone_links:
    # Fallback: count links in a section that contains 'intervention' or 'zones'
    sections = re.findall(r'<section[^>]*>.*?</section>', html, re.DOTALL)
    count = 0
    for s in sections:
        if 'intervention' in s.lower() or 'zones' in s.lower() or 'communes' in s.lower():
            count += len(re.findall(r'<a\s', s))
    print(count)
else:
    print(len(zone_links))
" 2>/dev/null || echo "0")
  if [ "$ZONES_LINKS" -lt 5 ]; then
    warn "Zones d'intervention links: $ZONES_LINKS (recommend 10+ zone links on service/product pages)"
  else
    pass "Zones d'intervention: $ZONES_LINKS links"
  fi
fi

# ========================================
# CHECK 23: Text-only sections (no visual)
# ========================================
if [ "$PAGE_TYPE" = "homepage" ] || [ "$PAGE_TYPE" = "service" ] || [ "$PAGE_TYPE" = "product" ]; then
  TEXT_ONLY_SECTIONS=$(echo "$HTML" | python3 -c "
import sys, re
html = sys.stdin.read()
# Find all <section> blocks
sections = re.findall(r'<section[^>]*>(.*?)</section>', html, re.DOTALL | re.IGNORECASE)
text_only = 0
for s in sections:
    # Skip very short sections (nav, footer, CTA buttons)
    text = re.sub(r'<[^>]+>', ' ', s)
    text = re.sub(r'\s+', ' ', text).strip()
    words = [w for w in text.split() if len(w) > 1]
    if len(words) < 30:
        continue  # Too short to be a content section
    # Skip FAQ sections (text-only is normal for FAQ)
    if 'faq' in s.lower() or 'question' in s.lower() or 'accordion' in s.lower():
        continue
    # Skip advantage/grid sections with numbered cards (design choice)
    if ('grid' in s.lower() or 'repeat(3' in s) and s.count('<div') > 10:
        continue
    # Check if section has any image or visual
    has_img = bool(re.search(r'<img\s|<svg\s|<video\s|<iframe\s|background-image|background:.*url', s, re.I))
    has_icon = bool(re.search(r'<i\s|icon|fa-|lucide|heroicon', s, re.I))
    if not has_img and not has_icon and len(words) > 50:
        text_only += 1
print(text_only)
" 2>/dev/null || echo "0")
  if [ "$TEXT_ONLY_SECTIONS" -gt 1 ]; then
    fail "Text-only sections (no visual): $TEXT_ONLY_SECTIONS (max 1 — every content section needs an image)"
  elif [ "$TEXT_ONLY_SECTIONS" -gt 0 ]; then
    warn "Text-only section detected: $TEXT_ONLY_SECTIONS (add images to all content sections)"
  else
    pass "All content sections have visuals"
  fi
fi

# ========================================
# CHECK 24: Google Maps embed (zone pages)
# ========================================
if [ "$PAGE_TYPE" = "zone" ]; then
  HAS_MAP=$(echo "$HTML" | gcount 'google.com/maps\|maps.googleapis\|maps.google')
  if [ "$HAS_MAP" -lt 1 ]; then
    warn "No Google Maps embed found on zone page (recommended for local signal)"
  else
    pass "Google Maps embed present"
  fi
fi

# === RESULT ===
echo ""
echo "============================================"
echo "Summary: $WORD_COUNT words | $IMG_COUNT imgs | $SECTION_COUNT sections | $H2_COUNT H2s"
echo "============================================"
if [ "$FAILS" -gt 0 ]; then
  echo -e "${RED}RESULT: FAIL${NC} ($FAILS fails, $WARNINGS warnings)"
  echo "FIX all fails before proceeding."
  exit 1
else
  if [ "$WARNINGS" -gt 0 ]; then
    echo -e "${YELLOW}RESULT: PASS with warnings${NC} ($WARNINGS warnings)"
  else
    echo -e "${GREEN}RESULT: PASS${NC}"
  fi
  echo "OK to proceed."
  exit 0
fi
