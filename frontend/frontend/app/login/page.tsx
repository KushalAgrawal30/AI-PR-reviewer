"use client";

export default function LoginPage() {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;

    console.log(clientId, redirectUri);

    const handleGitHubLogin = () => {
        const githubAuthUrl =
            `https://github.com/login/oauth/authorize` +
            `?client_id=${clientId}` +
            `&redirect_uri=${encodeURIComponent(redirectUri || "")}` + 
            `&prompt=select_account`;

        window.location.href = githubAuthUrl;
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-md border rounded-2xl shadow-sm p-8 text-center">
                <h1 className="text-3xl font-bold mb-3">Sign in</h1>
                <p className="text-gray-600 mb-6">
                    Continue with GitHub to access your repositories and PR reviews.
                </p>

                <button
                    onClick={handleGitHubLogin}
                    className="w-full rounded-xl border px-4 py-3 font-medium hover:bg-gray-50 transition"
                >
                    Continue with GitHub
                </button>
            </div>
        </main>
    );
}