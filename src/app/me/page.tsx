import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UserDashboard from "../ui/UserDashboard/UserDashboard";

export default async function MePage() {
    const session = await auth();

    if (!session?.user) {
        // Redirect to auth page with return URL
        redirect("/auth?returnUrl=/me");
    }

    const user = {
        id: session.user.id as string,
        name: session.user.name as string,
        email: session.user.email as string,
        role: (session.user as any).role as "user" | "admin"
    };

    return <UserDashboard user={user} />;
}