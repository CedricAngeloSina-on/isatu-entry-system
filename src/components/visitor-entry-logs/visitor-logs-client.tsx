"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { DataTable } from "~/components/visitor-entry-logs/data-table/data-table";
import { columns } from "~/components/visitor-entry-logs/data-table/columns";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { X } from "lucide-react";

export function VisitorEntryLogsClient() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Debounce search input - wait for user to finish typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = api.visitorEntryLog.getAllEntries.useQuery({
    search: debouncedSearch,
    page,
    perPage,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Filter entries by name or plate number..."
            className="h-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setDebouncedSearch("");
              }}
            >
              Reset
              <X />
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-24 items-center justify-center rounded-md border">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <DataTable
          data={data?.data ?? []}
          columns={columns}
          pageCount={data?.pageCount ?? 0}
          currentPage={page}
          perPage={perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
      )}
    </div>
  );
}
