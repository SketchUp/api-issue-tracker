// Applies labels based on the options selected in the "API" dropdown of the
// issue templates. Called from .github/workflows/label-issues-from-form.yml.

// Only these labels may be applied. addLabels creates labels that don't exist,
// so the issue body must not decide label names freely.
const ALLOWED_LABELS = ['Ruby API', 'C API', 'JS API (Labs)'];

module.exports = async ({ github, context }) => {
  const match = context.payload.issue.body?.match(/### API\s+([^\n]+)/);
  if (!match) {
    console.log('No API field found in the issue body.');
    return;
  }
  const labels = match[1].split(',').map(s => s.trim()).filter(s => ALLOWED_LABELS.includes(s));
  console.log(`Labels to add: ${labels.join(', ') || '(none)'}`);
  if (labels.length) {
    await github.rest.issues.addLabels({
      ...context.repo,
      issue_number: context.issue.number,
      labels,
    });
  }
};
