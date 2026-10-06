// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import Image from "next/image"

// This function SignUpSuccessPage handles the main work in this file and explains what this logic is doing in simple English.
export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-surface-2 flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <div className="flex justify-center mb-6">
          <Image src="/logo.webp" alt="CIRC" width={56} height={56} className="object-contain" />
        </div>
        <h1 className="font-display text-primary text-3xl font-bold mb-3">
          Account Created
        </h1>
        <p className="font-body text-muted text-base leading-relaxed mb-6">
          Your account has been created successfully. To access the CIRC admin panel,
          you need to be invited to the <strong>CIRC Admin</strong> organization by
          an existing administrator.
        </p>
        <div className="bg-surface border border-border rounded-xl p-5 text-left mb-6">
          <p className="font-body text-main text-sm font-medium mb-2">What happens next:</p>
          <ol className="font-body text-muted text-sm space-y-1 list-decimal list-inside">
            <li>Contact the CIRC system administrator</li>
            <li>Provide your registered email address</li>
            <li>You will receive an organization invite via email</li>
            <li>Accept the invite and sign in to access /admin</li>
          </ol>
        </div>
        <a href="/" className="btn-primary inline-flex">
          Go to Homepage
        </a>
      </div>
    </div>
  )
}
