import { useMemo } from 'react';  
import { useVenueStore } from '../store/venueStore';  

export function useSelectedEntities() {  
  const { tables, selectedTableId, selectedChairId } = useVenueStore();  

  const selectedTable = useMemo(() => {  
    return selectedTableId ? tables.find(t => t.id === selectedTableId) ?? null : null; 
  }, [selectedTableId, tables]);  

  const selectedChair = useMemo(() => {  
    if (!selectedTableId || !selectedChairId) return null;   
    return selectedTable?.chairs.find(c => c.id === selectedChairId) ?? null;
  }, [selectedTableId, selectedChairId, selectedTable]);  

  return { selectedTable, selectedChair };  
}  