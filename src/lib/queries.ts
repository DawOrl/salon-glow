import { serviceCategories, services } from "@/data/services";
import { team } from "@/data/team";
import type { Service, StaffMember } from "./types";

export const getServiceBySlug = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);

export const getServiceById = (id: string): Service | undefined =>
  services.find((s) => s.id === id);

export const getCategoryById = (id: string) =>
  serviceCategories.find((c) => c.id === id);

export const getServicesByCategory = (categoryId: string): Service[] =>
  services.filter((s) => s.categoryId === categoryId);

export const getStaffById = (id: string): StaffMember | undefined =>
  team.find((t) => t.id === id);

/** Styliści uprawnieni do danej usługi (do podstrony usługi i kreatora). */
export const getStaffForService = (service: Service): StaffMember[] =>
  service.staffIds
    .map((id) => getStaffById(id))
    .filter((s): s is StaffMember => Boolean(s));
