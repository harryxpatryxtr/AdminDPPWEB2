'use client';
import { useState } from "react";

export const useNewData = <T extends unknown[]>(initialData: T) => {
  const [newData, setNewData] = useState(initialData);
  return { newData, setNewData };
};
