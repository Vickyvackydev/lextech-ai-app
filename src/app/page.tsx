import { cookies } from "next/headers";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { Chat } from "@/components/custom/chat";
import { redirect } from "next/navigation";
import DashboardLayout from "@/shared/Layouts/DashboardLayout";

export default function Page() {
  return (
    <DashboardLayout>
      <Chat isNewChat={true} />
    </DashboardLayout>
  );
}
