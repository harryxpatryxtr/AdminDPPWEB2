import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";

export function ModalCreateDocuments() {
  return (
    <div>
      <form onSubmit={() => {}} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">
            Codigo
          </Label>
          <p className="col-span-3">00001</p>
        </div>
        <div className="grid grid-cols-4 items-center gap-x-4">
          <Label className="text-right">
            Tipo de Documento
          </Label>
          <p className="col-span-3">Documento 1</p>
        </div>
        <div className="grid grid-cols-4 items-center gap-x-4">
          <Label className="text-right">
            Descripcion
          </Label>
          <Input
            id="name"
            defaultValue="Descripcion 1"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-x-4">
          <Label className="text-right">
            Estado
          </Label>
          <Select
            onValueChange={() => {}}
            defaultValue="active"
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="active" />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="inactive">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Actualizar</Button>
      </form>
    </div>
  )
}