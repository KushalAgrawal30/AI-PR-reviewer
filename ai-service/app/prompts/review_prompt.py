def build_review_prompt(repository, title, description, changed_files):
    files_text = []

    for file in changed_files:
        files_text.append(
            f"File: {file.path}\nDiff:\n{file.patch}\n"
        )

    files_section = "\n\n".join(files_text)

    return f"""
    You are an expert code reviewer.

    Review the pull request diff and identify only actionable issues.

    Focus on:
    - bugs
    - security issues
    - null safety problems
    - bad error handling
    - missing validation
    - maintainability problems

    Do not give style-only suggestions unless they affect correctness or maintainability.
    Do not assume code that is not shown.
    Only comment on issues that are supported by the given diff.
    Return only valid JSON.
    Do not return markdown.
    Do not wrap the response in triple backticks.
    Do not include any explanation before or after the JSON.

    Return JSON in exactly this structure:
    {{
    "summary": "Found N actionable issue(s).",
    "findings": [
        {{
        "filePath": "src/main/java/com/example/UserService.java",
        "line": 12,
        "severity": "HIGH",
        "category": "BUG",
        "title": "Unsafe Optional access",
        "description": "Optional.get() may throw if the value is absent.",
        "suggestion": "Use orElseThrow with a meaningful exception.",
        "confidence": 0.92
        }}
    ]
    }}

    Rules:
    - summary must be a short string
    - findings must be an array
    - if there are no real issues, return:
    {{
        "summary": "No major issues found.",
        "findings": []
    }}
    - confidence must be a number between 0 and 1
    - severity must be one of: LOW, MEDIUM, HIGH, CRITICAL
    - category must be one of: BUG, SECURITY, VALIDATION, MAINTAINABILITY, PERFORMANCE

    Repository: {repository}
    PR Title: {title}
    PR Description: {description or "No description provided"}

    Changed Files:
    {files_section}
    """.strip()