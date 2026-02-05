import { MOCK_CUSTOMERS } from "../data/mockCustomers";
import type { Customer } from "../types/customer.types";

let customers: Customer[] = [...MOCK_CUSTOMERS];

type Subscriber = (items: Customer[]) => void;
const subscribers: Set<Subscriber> = new Set();

export function getCustomers() {
  return customers;
}

export function addCustomer(customer: Customer) {
  customers = [customer, ...customers];
  // notify subscribers
  subscribers.forEach((s) => s(customers));
  return customer;
}

export function subscribe(fn: Subscriber) {
  subscribers.add(fn);
  return () => { subscribers.delete(fn); };
}

export function clearCustomers() {
  customers = [];
  subscribers.forEach((s) => s(customers));
}

export function updateCustomer(id: string, updates: Partial<Customer>) {
  customers = customers.map(c => c.id === id ? { ...c, ...updates } : c);
  subscribers.forEach((s) => s(customers));
}

export function deleteCustomer(id: string) {
  customers = customers.filter(c => c.id !== id);
  subscribers.forEach((s) => s(customers));
}
