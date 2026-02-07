import { Ban, Bell, CheckCircle2, Clock, Package, PhoneOff, XCircle } from 'lucide-react';
  
export const  statuses = [
        { key: "pending", label: "pending", color: "bg-blue-100 text-blue-500 ring-blue-200", icon: <Bell className="w-4 h-4" /> },
        { key: "Connection failed 1", label: "Connectionfailed1", color: "bg-yellow-100 text-yellow-500 ring-yellow-200", icon: <PhoneOff className="w-4 h-4" /> },
        { key: "Connection failed 2", label: "Connectionfailed2", color: "bg-yellow-100 text-yellow-500 ring-yellow-200", icon: <PhoneOff className="w-4 h-4" /> },
        { key: "Connection failed 3", label: "Connectionfailed3", color: "bg-yellow-100 text-yellow-500 ring-yellow-200", icon: <PhoneOff className="w-4 h-4" /> },
        { key: "confirmed", label: "confirmed", color: "bg-green-100 text-green-500 ring-green-200", icon: <CheckCircle2 className="w-4 h-4" /> },
        { key: "ready", label: "ready", color: "bg-emerald-100 text-emerald-500 ring-emerald-200", icon: <Package className="w-4 h-4" /> },
        { key: "Postponed", label: "Postponed", color: "bg-purple-100 text-purple-500 ring-purple-200", icon: <Clock className="w-4 h-4" /> },
        { key: "cancelled", label: "cancelled", color: "bg-gray-100 text-gray-500 ring-gray-200", icon: <XCircle className="w-4 h-4" /> },
        { key: "failed", label: "failed", color: "bg-red-100 text-red-500 ring-red-200", icon: <Ban className="w-4 h-4" /> },
    ];