import { useState, useEffect } from 'react';

export interface CashMovement {
  id: number;
  cashRegister: string;
  employee: string;
  amount: number;
  date: string;
  movementType: 'Apertura' | 'Cierre' | 'Retiro Efectivo' | 'Ingreso Efectivo';
  description: string;
}

export interface CashRegisterLog {
  id: number;
  cashRegister: string;
  date: string;
  initialAmount: number;
  finalAmount: number;
  lastReason: string;
  isOpen: boolean;
}

const MOVEMENTS_KEY = 'odin-cash-movements';
const LOGS_KEY = 'odin-cash-logs';

// Datos iniciales de ejemplo
const initialMovements: CashMovement[] = [
  {
    id: 11,
    cashRegister: 'Caja 3',
    employee: 'Danny Garritas',
    amount: 32000,
    date: '2025-02-11T14:54:53',
    movementType: 'Retiro Efectivo',
    description: 'Cierre',
  },
  {
    id: 10,
    cashRegister: 'Caja 2',
    employee: 'Danny Garritas',
    amount: 2000,
    date: '2025-02-11T14:54:47',
    movementType: 'Ingreso Efectivo',
    description: 'Sobrante',
  },
  {
    id: 9,
    cashRegister: 'Caja 1',
    employee: 'Danny Garritas',
    amount: 50,
    date: '2025-01-06T18:43:23',
    movementType: 'Ingreso Efectivo',
    description: 'Haga',
  },
  {
    id: 8,
    cashRegister: 'Caja 1',
    employee: 'Danny Garritas',
    amount: 14682,
    date: '2025-01-06T19:40:13',
    movementType: 'Retiro Efectivo',
    description: 'Cierre',
  },
  {
    id: 7,
    cashRegister: 'Caja 1',
    employee: 'Danny Garritas',
    amount: 4293.5,
    date: '2025-09-09T18:15:56',
    movementType: 'Retiro Efectivo',
    description: 'M',
  },
  {
    id: 6,
    cashRegister: 'Caja 1',
    employee: 'Osvaldo Rodriguez',
    amount: 5000,
    date: '2025-09-09T10:58:18',
    movementType: 'Retiro Efectivo',
    description: 'L',
  },
  {
    id: 5,
    cashRegister: 'Caja 1',
    employee: 'Osvaldo Rodriguez',
    amount: 3000,
    date: '2025-09-09T10:56:03',
    movementType: 'Ingreso Efectivo',
    description: 'J',
  },
  {
    id: 4,
    cashRegister: 'Caja 1',
    employee: 'Osvaldo Rodriguez',
    amount: 0,
    date: '2025-09-09T10:35:44',
    movementType: 'Ingreso Efectivo',
    description: 'Cierre De Caja',
  },
  {
    id: 3,
    cashRegister: 'Caja 1',
    employee: 'Danny Garritas',
    amount: 200,
    date: '2025-09-09T04:08:55',
    movementType: 'Ingreso Efectivo',
    description: 'Tx',
  },
  {
    id: 2,
    cashRegister: 'Caja 1',
    employee: 'Danny Garritas',
    amount: 5000,
    date: '2025-09-09T04:00:31',
    movementType: 'Retiro Efectivo',
    description: 'Prueba',
  },
];

const initialLogs: CashRegisterLog[] = [
  {
    id: 1,
    cashRegister: 'Caja 1',
    date: '2025-02-11T14:54:53',
    initialAmount: 100,
    finalAmount: 0,
    lastReason: 'Cierre de turno',
    isOpen: false,
  },
];

export function useCashRegister() {
  const [movements, setMovements] = useState<CashMovement[]>([]);
  const [logs, setLogs] = useState<CashRegisterLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos desde localStorage
  useEffect(() => {
    try {
      const savedMovements = localStorage.getItem(MOVEMENTS_KEY);
      const savedLogs = localStorage.getItem(LOGS_KEY);

      if (savedMovements) {
        setMovements(JSON.parse(savedMovements));
      } else {
        setMovements(initialMovements);
        localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(initialMovements));
      }

      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      } else {
        setLogs(initialLogs);
        localStorage.setItem(LOGS_KEY, JSON.stringify(initialLogs));
      }
    } catch (error) {
      console.error('Error loading cash register data:', error);
      setMovements(initialMovements);
      setLogs(initialLogs);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Escuchar cambios en localStorage
  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const savedMovements = localStorage.getItem(MOVEMENTS_KEY);
        const savedLogs = localStorage.getItem(LOGS_KEY);

        if (savedMovements) {
          setMovements(JSON.parse(savedMovements));
        }

        if (savedLogs) {
          setLogs(JSON.parse(savedLogs));
        }
      } catch (error) {
        console.error('Error updating from localStorage:', error);
      }
    };

    window.addEventListener('cash-register-updated', handleStorageUpdate);
    return () => window.removeEventListener('cash-register-updated', handleStorageUpdate);
  }, []);

  // Guardar movimientos
  const saveMovements = (newMovements: CashMovement[]) => {
    try {
      localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(newMovements));
      setMovements(newMovements);
      window.dispatchEvent(new CustomEvent('cash-register-updated'));
    } catch (error) {
      console.error('Error saving movements:', error);
    }
  };

  // Guardar logs
  const saveLogs = (newLogs: CashRegisterLog[]) => {
    try {
      localStorage.setItem(LOGS_KEY, JSON.stringify(newLogs));
      setLogs(newLogs);
      window.dispatchEvent(new CustomEvent('cash-register-updated'));
    } catch (error) {
      console.error('Error saving logs:', error);
    }
  };

  // Agregar movimiento (lee directo de localStorage)
  const addMovement = (movement: Omit<CashMovement, 'id' | 'date'>) => {
    const savedMovements = localStorage.getItem(MOVEMENTS_KEY);
    const currentMovements = savedMovements ? JSON.parse(savedMovements) : [];
    
    const newMovement: CashMovement = {
      ...movement,
      id: currentMovements.length > 0 ? Math.max(...currentMovements.map((m: CashMovement) => m.id)) + 1 : 1,
      date: new Date().toISOString(),
    };
    const updatedMovements = [newMovement, ...currentMovements];
    saveMovements(updatedMovements);
    return newMovement;
  };

  // Abrir caja (lee directo de localStorage)
  const openCashRegister = (cashRegister: string, employee: string, initialAmount: number, description: string = 'Apertura') => {
    // Crear movimiento de apertura
    addMovement({
      cashRegister,
      employee,
      amount: initialAmount,
      movementType: 'Apertura',
      description,
    });

    // Leer logs actuales de localStorage
    const savedLogs = localStorage.getItem(LOGS_KEY);
    const currentLogs = savedLogs ? JSON.parse(savedLogs) : [];

    // Crear o actualizar log
    const existingLog = currentLogs.find((log: CashRegisterLog) => log.cashRegister === cashRegister);
    let updatedLogs: CashRegisterLog[];

    if (existingLog) {
      updatedLogs = currentLogs.map((log: CashRegisterLog) =>
        log.cashRegister === cashRegister
          ? { ...log, initialAmount, finalAmount: initialAmount, isOpen: true, date: new Date().toISOString(), lastReason: description }
          : log
      );
    } else {
      const newLog: CashRegisterLog = {
        id: currentLogs.length > 0 ? Math.max(...currentLogs.map((l: CashRegisterLog) => l.id)) + 1 : 1,
        cashRegister,
        date: new Date().toISOString(),
        initialAmount,
        finalAmount: initialAmount,
        lastReason: description,
        isOpen: true,
      };
      updatedLogs = [...currentLogs, newLog];
    }

    saveLogs(updatedLogs);
  };

  // Cerrar caja (lee directo de localStorage)
  const closeCashRegister = (cashRegister: string, employee: string, finalAmount: number, description: string = 'Cierre') => {
    // Leer logs actuales de localStorage
    const savedLogs = localStorage.getItem(LOGS_KEY);
    const currentLogs: CashRegisterLog[] = savedLogs ? JSON.parse(savedLogs) : [];
    
    const log = currentLogs.find(l => l.cashRegister === cashRegister && l.isOpen);
    
    if (!log) {
      throw new Error('Esta caja no está abierta');
    }

    // Crear movimiento de cierre
    addMovement({
      cashRegister,
      employee,
      amount: finalAmount,
      movementType: 'Cierre',
      description,
    });

    // Actualizar log
    const updatedLogs = currentLogs.map(l =>
      l.cashRegister === cashRegister && l.isOpen
        ? { ...l, finalAmount, isOpen: false, lastReason: description }
        : l
    );

    saveLogs(updatedLogs);
  };

  // Agregar ingreso/retiro (lee directo de localStorage)
  const addTransaction = (
    cashRegister: string, 
    employee: string, 
    amount: number, 
    type: 'Retiro Efectivo' | 'Ingreso Efectivo', 
    description: string
  ) => {
    // Leer logs actuales de localStorage
    const savedLogs = localStorage.getItem(LOGS_KEY);
    const currentLogs: CashRegisterLog[] = savedLogs ? JSON.parse(savedLogs) : [];
    
    const log = currentLogs.find(l => l.cashRegister === cashRegister && l.isOpen);
    
    if (!log) {
      throw new Error('Esta caja no está abierta');
    }

    // Crear movimiento
    addMovement({
      cashRegister,
      employee,
      amount,
      movementType: type,
      description,
    });

    // Actualizar monto final en log
    const updatedLogs = currentLogs.map(l => {
      if (l.cashRegister === cashRegister && l.isOpen) {
        const newAmount = type === 'Ingreso Efectivo' 
          ? l.finalAmount + amount 
          : l.finalAmount - amount;
        return { ...l, finalAmount: newAmount };
      }
      return l;
    });

    saveLogs(updatedLogs);
  };

  // Obtener caja por nombre
  const getCashRegisterLog = (cashRegister: string) => {
    return logs.find(log => log.cashRegister === cashRegister);
  };

  // Verificar si caja está abierta
  const isCashRegisterOpen = (cashRegister: string) => {
    const log = logs.find(l => l.cashRegister === cashRegister && l.isOpen);
    return !!log;
  };

  return {
    movements,
    logs,
    isLoading,
    addMovement,
    openCashRegister,
    closeCashRegister,
    addTransaction,
    getCashRegisterLog,
    isCashRegisterOpen,
  };
}