import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ListObjectInput } from '../form/ListObjectInput';
import { Combobox } from '../Combobox';
import {
    Form as FormRoot,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';

export function CreateOrConnectInput({
  form,
  fieldDef,
  inputProps,
}: {
  form: any,
  fieldDef: any,
  inputProps?: any;
}) {
  const [mode, setMode] = useState<"connect" | "create">('connect');

  const handleConnectChange = (val: any, controlField: any) => {
    form.setValue(fieldDef.createKey, undefined);
    controlField.onChange(val)
  }

  const handleCreateChange = (field: string, val: any, controlField: any) => {
    form.setValue(fieldDef.field, undefined);
    controlField.onChange({ ...controlField.value, [field]: val })
  }

  return (
    <div className="space-y-4">
      <FormLabel>{ fieldDef.label }</FormLabel>
      <RadioGroup value={mode} onValueChange={(val) => setMode(val as any)} className="flex gap-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="connect" id="connect" />
          <Label htmlFor="connect">Connect (ID)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="create" id="create" />
          <Label htmlFor="create">Create New</Label>
        </div>
      </RadioGroup>
      {
        mode === 'create' ? (
          <FormField
            key={fieldDef.createKey}
            control={form.control}
            name={fieldDef.createKey as any}
            render={({ field }) => {
                return <FormItem>
                    <div className="grid gap-2 md:grid-cols-3">
                      {fieldDef.createFields.map((f: any) => {
                        return <div key={f.field}>
                            {
                              f?.type === 'list' ? (
                                <FormControl>
                                    <ListObjectInput
                                        value={field.value}
                                        onChange={(v: any) => field.onChange(v)}
                                        fieldDefs={f.fields}
                                    />
                                </FormControl>
                              ) : (
                                <FormControl>
                                    {{
                                        text: (
                                          <Input
                                            placeholder={f.placeholder}
                                            value={field.value[f.field] || ''}
                                            onChange={(e) => handleCreateChange(f.field, e.target.value, field)}
                                          />
                                        ),
                                        number: (
                                            <Input
                                                type="number"
                                                placeholder={fieldDef.placeholder}
                                                {...field}
                                                onChange={(e) => handleCreateChange(f.field, Number(e.target.value), field)}
                                            />
                                        ),
                                        combobox: (
                                            <Combobox
                                                button={true}
                                                {...fieldDef.inputProps}
                                                value={field.value}
                                                onChange={(op) => handleCreateChange(f.field, op, field)}
                                            />
                                        ),
                                        date: (
                                            <DatePicker
                                                date={field.value}
                                                onChange={(date) => handleCreateChange(f.field, date, field)}
                                            />
                                        )
                                    }[(f?.type ?? 'text') as 'text' | 'number' | 'date' | 'combobox']}
                                </FormControl>
                              )
                            }
                        </div>
                      })}
                    </div>
                    <FormMessage />
                </FormItem>
            }}
          />
        ) : (
          <FormField
            key={fieldDef.field}
            control={form.control}
            name={fieldDef.field as any}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Combobox
                    button={true}
                    {...inputProps}
                    value={field.value}
                    onChange={(v) => handleConnectChange(v, field)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )
      }
    </div>
  );
}