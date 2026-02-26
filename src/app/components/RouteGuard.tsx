import { useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Home } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { SystemModule } from '../types/config.types';
import { Button } from './ui/button';

/**
 * ODIN POS - Route Guard
 * Protege rutas según módulos habilitados y permisos
 */