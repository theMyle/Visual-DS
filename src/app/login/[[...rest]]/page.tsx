import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
    return (
        <div className="flex w-full h-full justify-center items-center">
            <SignIn routing="path" path="/login" forceRedirectUrl="/" />
        </div>
    )
}