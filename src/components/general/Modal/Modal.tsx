
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

export function Modal({
  data,
  trigger,
  subTitle,
  title,
  setOpen,
  open,
  className
}: 
{
  data: React.ReactNode;
  trigger: React.ReactNode;
  subTitle?: string;
  title?: string;
  setOpen?: () => void;
  open?: boolean;
  className?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={className ?? "sm:max-w-[425px]"}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subTitle}</DialogDescription>
        </DialogHeader>
        {data}
      </DialogContent>
    </Dialog>
  );
}
