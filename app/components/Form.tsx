"use client";

import { useState, useEffect, Fragment } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form as FormRoot,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Combobox } from "./Combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { ListObjectInput } from "./form/ListObjectInput";
import { Icon } from "@iconify/react";

type FieldType =
  | "text"
  | "number"
  | "combobox"
  | "date"
  | "list"
type BaseField<T extends FieldType> = {
  type: T;
  label: string;
  field: string;
  placeholder?: string;
  inputProps?: Record<string, any>;
};

type BaseComboboxField = BaseField<"combobox"> & {
  multiple: boolean;
};

type BaseListField = BaseField<"list"> & {
  fields: {
    field: string;
    label: string;
    type: "text" | "number" | "date" | "combobox";
    placeholder?: string;
    inputProps?: Record<string, any>;
  }[];
};

export type FieldDefinition =
  | BaseField<"text">
  | BaseField<"number">
  | BaseComboboxField
  | BaseField<"date">
  | BaseListField;

export function Form({
  formSchema,
  defaultValues,
  callback,
  fields,
}: {
  formSchema: any;
  defaultValues: any;
  callback: (data: any) => void;
  fields: FieldDefinition[];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    callback(data);
  };

  return (
    <FormRoot {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((fieldDef: any) => {
          return (
            <FormField
              key={fieldDef.field}
              control={form.control}
              name={fieldDef.field as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{fieldDef.label}</FormLabel>
                  {fieldDef?.type === "list" ? (
                    <FormControl>
                      <ListObjectInput
                        value={field.value}
                        onChange={(v: any) => field.onChange(v)}
                        fieldDefs={fieldDef.fields}
                      />
                    </FormControl>
                  ) : (
                    <Fragment>
                      <FormControl>
                        {
                          {
                            text: (
                              <Input
                                placeholder={fieldDef.placeholder}
                                {...field}
                              />
                            ),
                            number: (
                              <Input
                                type="number"
                                placeholder={fieldDef.placeholder}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            ),
                            combobox: (
                              <Combobox
                                button={true}
                                {...fieldDef.inputProps}
                                value={field.value}
                                onChange={(v) =>
                                  field.onChange(
                                    fieldDef.multiple ? Array.from(new Set([...field.value, v])) : v,
                                    field
                                  )
                                }
                              />
                            ),
                            date: (
                              <DatePicker
                                date={field.value}
                                onChange={(e) => field.onChange(e)}
                              />
                            ),
                          }[
                            (fieldDef?.type ?? "text") as
                              | "text"
                              | "number"
                              | "date"
                              | "combobox"
                          ]
                        }
                      </FormControl>
                      {fieldDef.multiple && fieldDef.type === "combobox" && (
                        <div className="flex gap-2">
                          {field.value.map((value: any) => {
                            return (
                              <span
                                key={value}
																onClick={() => field.onChange(field.value.filter((v: any) => v !== value))}
                                className="flex gap-0.5 items-center px-2 py-1 text-xs rounded-md bg-accent text-foreground hover:text-gray-600 cursor-pointer"
                              >
																<Icon icon="lucide:x"/>
                                {
                                  fieldDef.inputProps.options.find(
                                    (option: any) => option.value === value
                                  )?.label
                                }
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </Fragment>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        <Button type="submit">Submit</Button>
      </form>
    </FormRoot>
  );
}
