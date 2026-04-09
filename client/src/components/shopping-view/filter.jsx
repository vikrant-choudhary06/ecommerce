import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-white rounded-none border-t border-zinc-200">
      <div className="p-4 py-6 border-b border-zinc-200">
        <h2 className="text-xl font-serif font-bold tracking-tight uppercase">Filters</h2>
      </div>
      <div className="p-4 space-y-6">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-4">{keyItem}</h3>
              <div className="grid gap-3">
                {filterOptions[keyItem].map((option) => (
                  <Label key={option.id} className="flex font-medium items-center gap-3 cursor-pointer group">
                    <Checkbox
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                      className="border-zinc-300 rounded-none data-[state=checked]:bg-black data-[state=checked]:text-white"
                    />
                    <span className="text-zinc-700 group-hover:text-black transition-colors">{option.label}</span>
                  </Label>
                ))}
              </div>
            </div>
            <Separator className="bg-zinc-100" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
