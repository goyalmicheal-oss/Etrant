import { GroupsSidebar } from "@/components/groups/groups-sidebar";

export default function GroupChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex max-md:h-[calc(100vh-64px)] max-md:mt-[64px] w-full bg-gray-100 dark:bg-gray-950 overflow-hidden">
            {/* Left Sidebar - Persistent, won't re-render when groupId changes */}
            <GroupsSidebar />

            {/* Right Side - Only this part refreshes when switching groups */}
            {children}
        </div>
    );
}
