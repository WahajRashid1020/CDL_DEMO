"use client";

import { useQuery } from "@tanstack/react-query";
import { calculators } from "@/lib/api/services";
import type { HazmatClass, Option } from "./types";

type ListResponse<T> = { data?: T[]; equipment_type?: T[] };

const list = <T,>(r: ListResponse<T>) => r.data ?? r.equipment_type ?? [];
const day = 24 * 60 * 60 * 1000;

export const useEquipmentTypes = () =>
  useQuery({
    queryKey: ["calc", "equipment_type"],
    queryFn: async () => list<Option>((await calculators.equipmentTypes()) as ListResponse<Option>),
    staleTime: day,
  });

export const useContainers = (enabled = true) =>
  useQuery({
    queryKey: ["calc", "containers"],
    queryFn: async () => list<Option>((await calculators.containers()) as ListResponse<Option>),
    enabled,
    staleTime: day,
  });

export const useContainerSizes = (containerId?: number) =>
  useQuery({
    queryKey: ["calc", "container_size", containerId],
    queryFn: async () =>
      list<Option>((await calculators.containerSizes(containerId!)) as ListResponse<Option>),
    enabled: containerId != null,
    staleTime: day,
  });

export const useChassis = (enabled = true) =>
  useQuery({
    queryKey: ["calc", "chassis"],
    queryFn: async () => list<Option>((await calculators.chassis()) as ListResponse<Option>),
    enabled,
    staleTime: day,
  });

export const useHazmatClasses = (enabled: boolean) =>
  useQuery({
    queryKey: ["calc", "hazmat_classes"],
    queryFn: async () => list<HazmatClass>((await calculators.hazmatClasses()) as ListResponse<HazmatClass>),
    enabled,
    staleTime: day,
  });

export const label = (o: Option) => o.title ?? o.name ?? `#${o.id}`;
export const pickDefault = (items?: Option[]) => items?.find((i) => i.is_default) ?? items?.[0];
