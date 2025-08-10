'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    Form as FormRoot,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Combobox } from './Combobox';
import { DatePicker } from '@/components/ui/date-picker';
import { ListObjectInput } from './form/ListObjectInput';
import { CreateOrConnectInput } from './form/CreateOrConnectInput';

type FieldType = 'text' | 'number' | 'combobox' | 'date' | 'list' | 'createOrConnect';
type BaseField<T extends FieldType> = {
    type: T;
    label: string;
    field: string;
    placeholder?: string;
    inputProps?: Record<string, any>;
};

type BaseListField = BaseField<'list'> & {
    fields: {
        field: string;
        label: string;
        type: 'text' | 'number' | 'date' | 'combobox';
        placeholder?: string;
        inputProps?: Record<string, any>;
    }[];
};

type BaseCreateOrConnectField = BaseField<'createOrConnect'> & {
    createKey: string,
    createFields: {
        field: string;
        label: string;
        type: 'text' | 'number' | 'date';
        placeholder?: string;
    }[];
};

type FieldDefinition =
    | BaseField<'text'>
    | BaseField<'number'>
    | BaseField<'combobox'>
    | BaseField<'date'>
    | BaseListField
    | BaseCreateOrConnectField;

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
                    return fieldDef.type === 'createOrConnect' ? 
                    <CreateOrConnectInput
                        key={fieldDef.field}
                        inputProps={fieldDef.inputProps}
                        form={form}
                        fieldDef={fieldDef}
                    />
                    : <FormField
                        key={fieldDef.field}
                        control={form.control}
                        name={fieldDef.field as any}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{fieldDef.label}</FormLabel>
                                {
                                    fieldDef?.type === 'list' ? (
                                        <FormControl>
                                            <ListObjectInput
                                                value={field.value}
                                                onChange={(v: any) => {
                                                    console.log(v)
                                                    field.onChange(v)
                                                }}
                                                fieldDefs={fieldDef.fields}
                                            />
                                        </FormControl>
                                    ) :
                                        <FormControl>
                                            {{
                                                text: <Input placeholder={fieldDef.placeholder} {...field} />,
                                                number: (
                                                    <Input
                                                        type="number"
                                                        placeholder={fieldDef.placeholder}
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                ),
                                                combobox: (
                                                    <Combobox
                                                        button={true}
                                                        {...fieldDef.inputProps}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                ),
                                                date: (
                                                    <DatePicker
                                                        date={field.value}
                                                        onChange={(e) => { console.log(e); field.onChange(e) }}
                                                    />
                                                )
                                            }[(fieldDef?.type ?? 'text') as 'text' | 'number' | 'date' | 'combobox']}
                                        </FormControl>
                                }
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                })}
                <Button type="submit">Submit</Button>
            </form>
        </FormRoot>
    );
}