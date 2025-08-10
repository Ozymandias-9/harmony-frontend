import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import { X, Plus } from "lucide-react"
import { Combobox } from "../Combobox"

export function ListObjectInput({
  value,
  onChange,
  fieldDefs,
}: {
  value: any[];
  onChange: (val: any[]) => void;
  fieldDefs: {
    field: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'combobox';
    placeholder?: string
    inputProps?: Record<string, any>;
  }[];
}) {
  const [currentItem, setCurrentItem] = React.useState<any>({})

  const handleChange = (field: string, val: any) => {
    setCurrentItem((prev: any) => ({
      ...prev,
      [field]: val,
    }))
  }

  const addItem = () => {
    if (Object.keys(currentItem).length === fieldDefs.length) {
      onChange([...(value || []), currentItem])
      setCurrentItem({})
    }
  }

  const removeItem = (index: number) => {
    const newList = [...value]
    newList.splice(index, 1)
    onChange(newList)
  }

  return (
    <div className="space-y-2">
      <div className="grid gap-2 md:grid-cols-3">
        {fieldDefs.map((f) => {
          return <div key={f.field}>
            {{
              text: (
                <Input
                  placeholder={f.placeholder}
                  value={currentItem[f.field] || ''}
                  onChange={(e) => handleChange(f.field, e.target.value)}
                />
              ),
              number: (
                <Input
                  type="number"
                  placeholder={f.placeholder}
                  value={currentItem[f.field] || ''}
                  onChange={(e) => handleChange(f.field, Number(e.target.value))}
                />
              ),
              combobox: (
                  <Combobox
                    button={true}
                    {...f.inputProps as any}
                    value={currentItem[f.field] || null}
                    onChange={(val) => handleChange(f.field, val)}
                    className="w-full justify-start overflow-hidden text-ellipsis block"
                  />
              ),
              date: (
                <DatePicker
                  date={currentItem[f.field] || null}
                  onChange={(date) => handleChange(f.field, date)}
                />
              ),
            }[f.type]}
          </div>
        })}
        <Button type="button" onClick={addItem}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <ul className="space-y-2 pt-4">
        <div className="flex gap-2">
          {fieldDefs.map((fd) => (
            <div key={fd.field} className="flex-1 uppercase text-gray-500 text-center text-xs">{ fd.label.toUpperCase() }</div>
          ))}
          <div className="flex-1 uppercase text-gray-500 text-center text-xs">Delete</div>
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[80px]">
          {value?.map((item, index) => (
            <div key={index} className="flex gap-2">
              {fieldDefs.map((f) => (
                <div key={f.field} className="flex-1 flex justify-center items-center text-sm">
                { f.type === 'date' ? (item[f.field]).toISOString().split('T')[0] : String(item[f.field]) }
                </div>
              ))}
              <Button className="flex-1" variant="ghost" onClick={() => removeItem(index)} size="icon">
                <X className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </ul>
    </div>
  )
}