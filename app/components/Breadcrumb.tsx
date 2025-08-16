import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Fragment } from "react"
import { Icon } from "@iconify/react";

interface IBreadcrumbItem {
        value: any,
        render?: (val: any) => any,
        link?: {
            href: string
        }
    }

export default function Breadcrumb({
    items,
}: {
    items: IBreadcrumbItem[]
}) {
    return <BreadcrumbRoot>
        <BreadcrumbList>
            {
                items.map((item: IBreadcrumbItem, index: number) => {
                    const TargetChild = item.link ? BreadcrumbLink : BreadcrumbPage;
                    return <Fragment key={index}>
                        <BreadcrumbItem>
                            <TargetChild {...item.link}>{ item.render ? item.render(item.value) : item.value }</TargetChild>
                        </BreadcrumbItem>
                        {
                            index < items.length - 1 && <BreadcrumbSeparator><Icon icon="tabler:slash" /></BreadcrumbSeparator>
                        }
                    </Fragment>
                })
            }
        </BreadcrumbList>
    </BreadcrumbRoot>
}