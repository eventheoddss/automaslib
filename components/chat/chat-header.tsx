
// import { SocketIndicator } from "@/components/socket-indicator";

interface ChatHeaderProps {
  bookId: string;
  name: string;
}

export const ChatHeader = ({
  bookId,
  name,
}: ChatHeaderProps) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
    
      <p className="font-semibold text-md text-black dark:text-white">
        {name}
      </p>

      <div className="ml-auto flex items-center">
        {/* <SocketIndicator /> */}
      </div>
    </div>
  )
}