
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
  open
}: 
{
  data: React.ReactNode;
  trigger: React.ReactNode;
  subTitle?: string;
  title?: string;
  setOpen?: () => void;
  open?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subTitle}</DialogDescription>
        </DialogHeader>
        {data}
      </DialogContent>
    </Dialog>
  );
}
