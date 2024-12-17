import { Chat as PreviewChat } from "@/components/custom/chat";
import DashboardLayout from "@/shared/Layouts/DashboardLayout";

export default async function Page() {
  return (
    <DashboardLayout>
      <PreviewChat isNewChat={false} />
    </DashboardLayout>
  );
}
