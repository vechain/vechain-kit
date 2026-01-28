#!/bin/bash

# Bundle Size Comparison Script
# Compares vechain-kit bundle sizes between two git branches
#
# Usage:
#   ./scripts/compare-bundle-sizes.sh <base-branch> <compare-branch>
#   ./scripts/compare-bundle-sizes.sh main ralph/barrel-imports

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
BOLD='\033[1m'

BASE_BRANCH=${1:-main}
COMPARE_BRANCH=${2:-$(git branch --show-current)}
TEMP_DIR=$(mktemp -d)
RESULTS_FILE="bundle-size-comparison.md"

echo -e "${BLUE}${BOLD}VeChain Kit Bundle Size Comparison${NC}"
echo -e "${BLUE}══════════════════════════════════${NC}"
echo ""
echo -e "Base branch:    ${YELLOW}$BASE_BRANCH${NC}"
echo -e "Compare branch: ${YELLOW}$COMPARE_BRANCH${NC}"
echo -e "Results will be saved to: ${YELLOW}$RESULTS_FILE${NC}"
echo ""

# Store current branch
CURRENT_BRANCH=$(git branch --show-current)

# Function to get total size of dist folder
get_dist_size() {
    local branch=$1
    local output_file="$TEMP_DIR/${branch//\//_}_files.txt"
    
    >&2 echo -e "\n${BLUE}Building $branch...${NC}"
    
    # Checkout branch
    git checkout "$branch" -q
    
    # Clean and build
    cd packages/vechain-kit
    rm -rf dist .turbo
    yarn build > /dev/null 2>&1
    
    # Get sizes (compatible with macOS and Linux)
    local total_size=$(du -sh dist 2>/dev/null | awk '{print $1}')
    
    # Use gdu if available (GNU du), otherwise calculate from files
    if command -v gdu &> /dev/null; then
        local total_bytes=$(gdu -sb dist 2>/dev/null | awk '{print $1}')
    else
        # macOS fallback: sum all file sizes
        local total_bytes=$(find dist -type f -exec stat -f%z {} + 2>/dev/null | awk '{sum+=$1} END {print sum}')
    fi
    
    # Save detailed file list (macOS compatible)
    if command -v gdu &> /dev/null; then
        find dist -type f -exec gdu -b {} + | sort -k2 > "$output_file"
    else
        # macOS: use stat instead
        find dist -type f | while read f; do 
            echo "$(stat -f%z "$f") $f"
        done | sort -k2 > "$output_file"
    fi
    
    cd ../..
    
    # Output only the result, no ANSI codes
    echo "$total_bytes|$total_size|$output_file"
}

echo -e "${BLUE}${BOLD}Step 1: Building base branch ($BASE_BRANCH)${NC}"
BASE_RESULT=$(get_dist_size "$BASE_BRANCH")
BASE_BYTES=$(echo "$BASE_RESULT" | cut -d'|' -f1)
BASE_SIZE=$(echo "$BASE_RESULT" | cut -d'|' -f2)
BASE_FILE=$(echo "$BASE_RESULT" | cut -d'|' -f3)

echo -e "${BLUE}${BOLD}Step 2: Building compare branch ($COMPARE_BRANCH)${NC}"
COMPARE_RESULT=$(get_dist_size "$COMPARE_BRANCH")
COMPARE_BYTES=$(echo "$COMPARE_RESULT" | cut -d'|' -f1)
COMPARE_SIZE=$(echo "$COMPARE_RESULT" | cut -d'|' -f2)
COMPARE_FILE=$(echo "$COMPARE_RESULT" | cut -d'|' -f3)

# Return to original branch
git checkout "$CURRENT_BRANCH" -q

# Calculate difference
DIFF_BYTES=$((COMPARE_BYTES - BASE_BYTES))
DIFF_PERCENT=$(awk "BEGIN {printf \"%.2f\", ($DIFF_BYTES / $BASE_BYTES) * 100}")

# Determine color for difference
if [ $DIFF_BYTES -gt 0 ]; then
    DIFF_COLOR=$RED
    DIFF_SIGN="+"
elif [ $DIFF_BYTES -lt 0 ]; then
    DIFF_COLOR=$GREEN
    DIFF_SIGN=""
else
    DIFF_COLOR=$YELLOW
    DIFF_SIGN=""
fi

# Convert bytes to human readable (macOS compatible)
human_bytes() {
    local bytes=$1
    local abs_bytes=${bytes#-}
    
    if [ $abs_bytes -gt 1073741824 ]; then
        printf "%.2fGB" $(echo "scale=2; $bytes / 1073741824" | bc)
    elif [ $abs_bytes -gt 1048576 ]; then
        printf "%.2fMB" $(echo "scale=2; $bytes / 1048576" | bc)
    elif [ $abs_bytes -gt 1024 ]; then
        printf "%.2fKB" $(echo "scale=2; $bytes / 1024" | bc)
    else
        echo "${bytes}B"
    fi
}

DIFF_HUMAN=$(human_bytes $DIFF_BYTES)

# Display summary
echo ""
echo -e "${BLUE}${BOLD}═══════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}Summary${NC}"
echo -e "${BLUE}${BOLD}═══════════════════════════════════════════════════════${NC}"
echo ""
printf "%-20s %15s (%s bytes)\n" "$BASE_BRANCH:" "$BASE_SIZE" "$BASE_BYTES"
printf "%-20s %15s (%s bytes)\n" "$COMPARE_BRANCH:" "$COMPARE_SIZE" "$COMPARE_BYTES"
echo -e "${DIFF_COLOR}${BOLD}Difference:          ${DIFF_SIGN}${DIFF_HUMAN} (${DIFF_SIGN}${DIFF_PERCENT}%)${NC}"
echo ""

# Generate detailed markdown report
cat > "$RESULTS_FILE" << EOF
# Bundle Size Comparison

## Summary

| Branch | Total Size | Size (bytes) |
|--------|------------|--------------|
| \`$BASE_BRANCH\` | $BASE_SIZE | $BASE_BYTES |
| \`$COMPARE_BRANCH\` | $COMPARE_SIZE | $COMPARE_BYTES |
| **Difference** | **${DIFF_SIGN}${DIFF_HUMAN}** | **${DIFF_SIGN}${DIFF_BYTES}** |
| **Change %** | **${DIFF_SIGN}${DIFF_PERCENT}%** | |

EOF

# Compare file by file
echo -e "${BLUE}${BOLD}Step 3: Analyzing file-by-file changes${NC}"

# Get list of all files from both branches
ALL_FILES=$(cat "$BASE_FILE" "$COMPARE_FILE" | awk '{print $2}' | sed 's|.*/dist/||' | sort -u)

# Arrays for categorizing changes
declare -a NEW_FILES
declare -a REMOVED_FILES
declare -a CHANGED_FILES
declare -a UNCHANGED_FILES

while IFS= read -r file; do
    base_size=$(grep "dist/$file$" "$BASE_FILE" 2>/dev/null | awk '{print $1}' || echo "0")
    compare_size=$(grep "dist/$file$" "$COMPARE_FILE" 2>/dev/null | awk '{print $1}' || echo "0")
    
    if [ "$base_size" = "0" ] && [ "$compare_size" != "0" ]; then
        NEW_FILES+=("$file|$compare_size")
    elif [ "$base_size" != "0" ] && [ "$compare_size" = "0" ]; then
        REMOVED_FILES+=("$file|$base_size")
    elif [ "$base_size" != "$compare_size" ]; then
        diff=$((compare_size - base_size))
        CHANGED_FILES+=("$file|$base_size|$compare_size|$diff")
    else
        UNCHANGED_FILES+=("$file|$base_size")
    fi
done <<< "$ALL_FILES"

# Add new files section
if [ ${#NEW_FILES[@]} -gt 0 ]; then
    cat >> "$RESULTS_FILE" << EOF

## ✨ New Files (${#NEW_FILES[@]})

| File | Size |
|------|------|
EOF
    for item in "${NEW_FILES[@]}"; do
        file=$(echo "$item" | cut -d'|' -f1)
        size=$(echo "$item" | cut -d'|' -f2)
        human=$(human_bytes "$size")
        echo "| \`$file\` | $human |" >> "$RESULTS_FILE"
    done
fi

# Add removed files section
if [ ${#REMOVED_FILES[@]} -gt 0 ]; then
    cat >> "$RESULTS_FILE" << EOF

## 🗑️  Removed Files (${#REMOVED_FILES[@]})

| File | Previous Size |
|------|---------------|
EOF
    for item in "${REMOVED_FILES[@]}"; do
        file=$(echo "$item" | cut -d'|' -f1)
        size=$(echo "$item" | cut -d'|' -f2)
        human=$(human_bytes "$size")
        echo "| \`$file\` | $human |" >> "$RESULTS_FILE"
    done
fi

# Add changed files section
if [ ${#CHANGED_FILES[@]} -gt 0 ]; then
    cat >> "$RESULTS_FILE" << EOF

## 📝 Modified Files (${#CHANGED_FILES[@]})

| File | Before | After | Change |
|------|--------|-------|--------|
EOF
    for item in "${CHANGED_FILES[@]}"; do
        file=$(echo "$item" | cut -d'|' -f1)
        base_size=$(echo "$item" | cut -d'|' -f2)
        compare_size=$(echo "$item" | cut -d'|' -f3)
        diff=$(echo "$item" | cut -d'|' -f4)
        
        base_human=$(human_bytes "$base_size")
        compare_human=$(human_bytes "$compare_size")
        diff_human=$(human_bytes "$diff")
        
        if [ $diff -gt 0 ]; then
            diff_display="+$diff_human"
        else
            diff_display="$diff_human"
        fi
        
        echo "| \`$file\` | $base_human | $compare_human | $diff_display |" >> "$RESULTS_FILE"
    done
fi

# Add entry point comparison if applicable
cat >> "$RESULTS_FILE" << EOF

## 📦 Entry Points Analysis

### Base Branch (\`$BASE_BRANCH\`)
\`\`\`
EOF

find packages/vechain-kit/dist -maxdepth 2 -name "index.*" -type f 2>/dev/null | while read file; do
    git show "$BASE_BRANCH:${file#packages/vechain-kit/}" > /dev/null 2>&1 && \
    du -h "$file" 2>/dev/null | awk '{print $2 ": " $1}' >> "$RESULTS_FILE" || true
done

cat >> "$RESULTS_FILE" << EOF
\`\`\`

### Compare Branch (\`$COMPARE_BRANCH\`)
\`\`\`
EOF

find packages/vechain-kit/dist -maxdepth 2 -name "index.*" -type f 2>/dev/null | \
du -h {} 2>/dev/null | awk '{print $2 ": " $1}' >> "$RESULTS_FILE"

cat >> "$RESULTS_FILE" << EOF
\`\`\`

---

*Generated on $(date)*
*Base: \`$BASE_BRANCH\` | Compare: \`$COMPARE_BRANCH\`*
EOF

# Cleanup
rm -rf "$TEMP_DIR"

echo -e "${GREEN}${BOLD}✅ Comparison complete!${NC}"
echo -e "Detailed report saved to: ${YELLOW}$RESULTS_FILE${NC}"
echo ""
echo -e "${BLUE}View the report:${NC}"
echo -e "  cat $RESULTS_FILE"
echo ""
