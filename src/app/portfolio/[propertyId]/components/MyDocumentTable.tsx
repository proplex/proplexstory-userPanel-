import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Mail } from "lucide-react";
import React, { useState } from "react";

const MyDocumentTable = () => {
  const documents = [
    {
      name: "Fractional Ownership Agreement",
      category: "Ownership",
      status: "Signed",
      date: "12-07-2025 12:05",
    },
    {
      name: "LLC Member Ownership",
      category: "Ownership",
      status: "Not Signed",
      date: "12-07-2025 12:05",
    },
    {
      name: "Agreement",
      category: "Ownership",
      status: "Signed",
      date: "12-07-2025 12:05",
    },
  ];
  const[filter, setFilter] = useState("All");
  const filteredDocs =
    filter === "All"
      ? documents
      : documents.filter((doc) => doc.status === filter);


  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">My Documents</h2>
        <div className="flex items-center gap-3">
          {/* Select Dropdown */}
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Signed">Signed</SelectItem>
              <SelectItem value="Not Signed">Not Signed</SelectItem>
            </SelectContent>
          </Select>

          {/* Send All Docs Button */}
          <Button
            variant="outline"
            className="rounded-lg border-primary text-primary"
          >
            Send All Doc’s to email
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="pl-4">Document</TableHead>
              <TableHead className="">Category</TableHead>
              <TableHead className="">Status</TableHead>
              <TableHead className="">Signed On</TableHead>
              <TableHead className="text-center">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocs.map((doc, index) => (
              <TableRow key={index}>
                <TableCell className="pl-4">{doc.name}</TableCell>
                <TableCell className=" font-semibold">
                  {doc.category}
                </TableCell>
                <TableCell>
                  {doc.status === "Signed" ? (
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                      Signed
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm">
                      Not Signed
                    </span>
                  )}
                </TableCell>
                <TableCell>{doc.date}</TableCell>
                <TableCell className="flex justify-end items-center gap-2">
                  {doc.status === "Not Signed" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-primary border-primary"
                    >
                      Sign Now
                    </Button>
                  ) : (
                    <>
                      <Button size="icon" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MyDocumentTable;
