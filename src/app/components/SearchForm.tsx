"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multiple-select";
import { useAppStore } from "@/store/app";
import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 定义表单数据类型
const formSchema = z.object({
  countries: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .min(1, "Please select at least one country"),
  cities: z.array(z.string()).optional(),
  intervention: z.string().optional(),
  populations: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional(),
  subFilterKey: z.string().min(1, "Please select a sub filter key"),
  subFilterValue: z.string().min(1, "Please select a sub filter value"),
});

type FormValues = z.infer<typeof formSchema>;

const SearchForm = () => {
  const countryOptions = useAppStore((s) => s.countryOptions);
  const interventionOptions = useAppStore((s) => s.interventionOptions);
  const populationOptions = useAppStore((s) => s.popluationOptions);
  const subFilterKeyOptions = useAppStore((s) => s.subFilterKeyOptions);
  const formValues = useAppStore((s) => s.form);
  const updateForm = useAppStore((s) => s.updateForm);
  const [filterValueOptions, setFilterValueOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: {
      ...formValues,
      countries: formValues.countries.map((item) => ({
        label: item,
        value: item,
      })),
      populations: formValues.populations
        ? formValues.populations.map((item) => ({
            value: item,
            label: item,
          }))
        : undefined,
    },
  });

  const handleFilterKeyChange = useCallback(
    (filterKey: string) => {
      form.setValue("subFilterValue", "");
      const options =
        subFilterKeyOptions.find((option) => option.value === filterKey)
          ?.options ?? [];
      setFilterValueOptions(options);
    },
    [subFilterKeyOptions, form]
  );

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("Form submitted:", data);
    updateForm({
      ...data,
      countries: data.countries.map((item) => item.value),
      populations: data.populations
        ? data.populations.map((item) => item.value)
        : undefined,
    });
  };

  useEffect(() => {}, [formValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="countries"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Country</FormLabel>
              <MultipleSelector {...field} options={countryOptions} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="intervention"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intervention</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a verified intervention to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {interventionOptions.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="populations"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Population</FormLabel>
              <MultipleSelector {...field} options={populationOptions} />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex">
          <FormField
            control={form.control}
            name="subFilterKey"
            render={({ field }) => (
              <FormItem className="flex-1">
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleFilterKeyChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a verified intervention to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subFilterKeyOptions.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subFilterValue"
            render={({ field }) => (
              <FormItem className="flex-1">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a verified intervention to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filterValueOptions.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default SearchForm;
