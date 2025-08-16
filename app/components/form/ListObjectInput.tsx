"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import { Icon } from "@iconify/react"
import { Combobox } from "../Combobox"

export function ListObjectInput({
  value = [],
  onChange,
  fieldDefs,
  onInputChange,
}: {
  value?: any[];
  onChange: (val: any) => void;
  fieldDefs: {
    field: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'combobox';
    placeholder?: string
    inputProps?: Record<string, any>;
    render?: (val: any) => any;
  }[];
  onInputChange?: (key: string, val: any, currentItem: any) => any
}) {
  const [currentEditIndex, setCurrentEditIndex] = useState<number | undefined>(undefined);
  const [currentItem, setCurrentItem] = useState<any>({})

  const handleChange = (field: string, val: any) => {
    let newCurrentItem = undefined;
    if (onInputChange) {
      newCurrentItem = onInputChange(field, val, currentItem)
    }
    setCurrentItem((prev: any) => (newCurrentItem ?? {
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

  const saveItem = () => {
    if (Object.keys(currentItem).length >= fieldDefs.length && currentEditIndex !== undefined) {
      let newValue = [...value];
      newValue[currentEditIndex] = currentItem;
      onChange(newValue)
      setCurrentEditIndex(undefined);
      setCurrentItem({})
    }
  }

  const removeItem = (index: number) => {
    const newList = [...value]
    newList.splice(index, 1)
    onChange(newList)
  }

  const editItem = (index: number) => {
    setCurrentEditIndex(index);
    setCurrentItem(value[index]);
  }

  return (
    <div className="flex flex-col gap-2 overflow-hidden p-2">
      <div className="grid gap-2 max-md:grid-cols-1" style={{ gridTemplateColumns: `repeat(${fieldDefs.length}, minmax(0, 1fr))` }}>
        {fieldDefs.map((f) => {
          return <div key={f.field}>
            {{
              text: (
                <Input
                  placeholder={f.placeholder}
                  value={currentItem[f.field] || ''}
                  onChange={(e) => handleChange(f.field, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                />
              ),
              number: (
                <Input
                  type="number"
                  placeholder={f.placeholder}
                  value={currentItem[f.field] || ''}
                  onChange={(e) => handleChange(f.field, Number(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                />
              ),
              combobox: (
                  <Combobox
                    button={true}
                    {...f.inputProps as any}
                    value={currentItem[f.field] || null}
                    onChange={(val) => handleChange(f.field, val)}
                    className="w-full text-left overflow-hidden text-ellipsis block"
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
        <Button type="button" onClick={() => (currentEditIndex !== undefined ? saveItem : addItem)()}>
          { currentEditIndex !== undefined ? "Save" : <Icon icon="lucide:plus" className="w-4 h-4" /> }
        </Button>
      </div>

      <ul className="space-y-2 mt-4 overflow-y-auto overflow-x-hidden relative invisible-scrollbar">
        <div className="flex gap-2 sticky top-0 bg-background border-b py-2">
          {fieldDefs.map((fd) => {
            return <div key={fd.field} className="flex-1 uppercase text-gray-500 text-center text-xs">{ fd.label.toUpperCase() }</div>
          })}
          <div className="flex-1 uppercase text-gray-500 text-center text-xs">Actions</div>
        </div>
        {value?.map((item, index) => (
          <div key={index} className="flex gap-2 h-8">
            {fieldDefs.map((f) => (
              <div key={f.field} className="flex-1 w-full text-center text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                { f.type === 'date' ? (item[f.field]).toISOString().split('T')[0] : (f.render ? f.render(item[f.field]) : String(item[f.field])) }
              </div>
            ))}
            <div className="flex-1 flex justify-center gap-3">
              <Icon onClick={() => removeItem(index)} icon="lucide:x" className="w-5 h-5 text-red-500" />
              <Icon onClick={() => editItem(index)} icon="lucide:pencil" className="w-5 h-5 text-lime-500" />
            </div>
          </div>
        ))}
      </ul>
    </div>
  )
}