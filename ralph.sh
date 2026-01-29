#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations>"
  exit 1
fi

# Function to format elapsed time
format_time() {
  local seconds=$1
  printf "%02d:%02d" $((seconds / 60)) $((seconds % 60))
}

# Function to parse and display streaming JSON
parse_stream() {
  local start_time=$(date +%s)

  while IFS= read -r line; do
    local now=$(date +%s)
    local elapsed=$((now - start_time))
    local timestamp="[$(format_time $elapsed)]"

    # Extract type and content from JSON
    local type=$(echo "$line" | jq -r '.type // empty' 2>/dev/null)

    case "$type" in
      "assistant")
        local content=$(echo "$line" | jq -r '.message.content // empty' 2>/dev/null)
        if [ -n "$content" ]; then
          echo -e "$timestamp 💬 $content"
        fi
        ;;
      "user")
        local content=$(echo "$line" | jq -r '.message.content // empty' 2>/dev/null)
        if [ -n "$content" ] && [ "$content" != "null" ]; then
          echo -e "$timestamp 👤 $content"
        fi
        ;;
      "tool_use")
        local tool=$(echo "$line" | jq -r '.tool // empty' 2>/dev/null)
        if [ -n "$tool" ]; then
          echo -e "$timestamp 🔧 Using tool: $tool"
        fi
        ;;
      "tool_result")
        echo -e "$timestamp ✅ Tool completed"
        ;;
      "result")
        local cost=$(echo "$line" | jq -r '.cost_usd // empty' 2>/dev/null)
        local duration=$(echo "$line" | jq -r '.duration_ms // empty' 2>/dev/null)
        if [ -n "$cost" ]; then
          echo -e "$timestamp 💰 Cost: \$$cost"
        fi
        ;;
      "error")
        local error=$(echo "$line" | jq -r '.error.message // .error // empty' 2>/dev/null)
        echo -e "$timestamp ❌ Error: $error"
        ;;
    esac
  done
}

for ((i=1; i<=$1; i++)); do
  echo ""
  echo "╔════════════════════════════════════════════════════════════════╗"
  echo "║  RALPH ITERATION $i                                            "
  echo "╚════════════════════════════════════════════════════════════════╝"
  echo ""

  start_time=$(date +%s)

  # Run claude with streaming JSON and parse output
  claude --dangerously-skip-permissions --output-format stream-json -p "@prd.json @progress.txt \
1. Find the highest-priority feature with passes:false and work only on that feature. \
2. Check that the types check via yarn kit:typecheck. \
3. Update prd.json: set passes:true and add notes for the completed story. \
4. Append your progress to progress.txt with details of what was done. \
5. Make a git commit for that feature. \
ONLY WORK ON A SINGLE FEATURE. \
If all stories have passes:true, output <promise>COMPLETE</promise> and stop." 2>&1 | parse_stream

  exit_code=${PIPESTATUS[0]}
  end_time=$(date +%s)
  elapsed=$((end_time - start_time))

  echo ""
  echo "────────────────────────────────────────────────────────────────"
  echo "Iteration $i finished with exit code: $exit_code"
  echo "⏱️  Total time: $(format_time $elapsed)"
  echo "────────────────────────────────────────────────────────────────"

  # Check if PRD is complete by reading prd.json
  if grep -q '"passes": false' prd.json 2>/dev/null; then
    remaining=$(grep -c '"passes": false' prd.json)
    echo "📋 Remaining stories: $remaining"
  else
    echo "✅ All stories complete!"
    echo "PRD complete, exiting."
    exit 0
  fi

  echo ""
  sleep 2
done

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "Ralph completed $1 iterations. Check prd.json for remaining stories."
echo "═══════════════════════════════════════════════════════════════════"
