/**
 * ODIN POS - Employees Service
 * Servicio para gestión de empleados
 */

import { Employee } from '../types/employee.types';
import { BusinessType } from '../types/config.types';
import { getEmployeesByBusinessType } from '../data/employeesMockData';

const STORAGE_KEY = 'odin_employees';

// ========================================
// LOCAL STORAGE HELPERS
// ========================================

function getEmployeesFromStorage(businessType: BusinessType): Employee[] {
  if (typeof window === 'undefined') {
    return getEmployeesByBusinessType(businessType);
  }
  
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${businessType}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading employees from storage:', error);
  }
  
  // Si no hay datos, usar los mock
  const mockData = getEmployeesByBusinessType(businessType);
  saveEmployeesToStorage(businessType, mockData);
  return mockData;
}

function saveEmployeesToStorage(businessType: BusinessType, employees: Employee[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(`${STORAGE_KEY}_${businessType}`, JSON.stringify(employees));
  } catch (error) {
    console.error('Error saving employees to storage:', error);
  }
}

// ========================================
// SERVICE
// ========================================

export const EmployeesService = {
  /**
   * Obtener todos los empleados activos de un tipo de negocio
   */
  getActive(businessType: BusinessType): Employee[] {
    const employees = getEmployeesFromStorage(businessType);
    return employees.filter(emp => emp.status === 'active');
  },

  /**
   * Obtener todos los empleados
   */
  getAll(businessType: BusinessType): Employee[] {
    return getEmployeesFromStorage(businessType);
  },

  /**
   * Obtener empleado por ID
   */
  getById(businessType: BusinessType, id: string): Employee | undefined {
    const employees = getEmployeesFromStorage(businessType);
    return employees.find(emp => emp.id === id);
  },

  /**
   * Obtener empleados por rol
   */
  getByRole(businessType: BusinessType, role: string): Employee[] {
    const employees = getEmployeesFromStorage(businessType);
    return employees.filter(emp => emp.role === role && emp.status === 'active');
  },

  /**
   * Obtener técnicos/especialistas (para Spa)
   * Excluye gerentes y supervisores
   */
  getTechnicians(businessType: BusinessType): Employee[] {
    const employees = getEmployeesFromStorage(businessType);
    const excludedRoles = ['gerente', 'supervisor', 'encargado', 'admin'];
    
    return employees.filter(
      emp => emp.status === 'active' && !excludedRoles.includes(emp.role.toLowerCase())
    );
  },
};
