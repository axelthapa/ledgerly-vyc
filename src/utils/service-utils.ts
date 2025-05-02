
import { dbQuery, dbUpdate, isElectron } from './electron-utils';
import { toast } from '@/components/ui/toast-utils';
import { DbResult } from './db-operations';
import { formatDate } from './nepali-date';

export interface Service {
  id: string;
  customer_id?: string;
  customer_name: string;
  device_type: string;
  device_model?: string;
  device_serial?: string;
  problem_description: string;
  service_date: Date | string;
  is_warranty: boolean;
  technician?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  diagnosis?: string;
  repair_notes?: string;
  parts_used?: { name: string; price: number }[];
  estimated_cost: number;
  final_cost?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Create a new service
export async function createService(service: Omit<Service, 'id'>): Promise<DbResult<string>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // Generate next service ID
    const idResult = await dbQuery(
      "SELECT id FROM services ORDER BY id DESC LIMIT 1"
    );
    
    let nextId = 'SV001';
    
    if (idResult.success && idResult.data && idResult.data.length > 0) {
      const lastId = idResult.data[0].id;
      const idNumber = parseInt(lastId.substring(2), 10);
      nextId = `SV${(idNumber + 1).toString().padStart(3, '0')}`;
    }
    
    // Format service date
    let serviceDate = service.service_date;
    if (serviceDate instanceof Date) {
      serviceDate = formatDate(serviceDate);
    }
    
    // Convert parts_used array to JSON if it exists
    const partsUsed = service.parts_used ? JSON.stringify(service.parts_used) : null;
    
    // Insert new service
    const result = await dbUpdate(
      `INSERT INTO services (
        id, customer_id, customer_name, device_type, device_model, device_serial, 
        problem_description, service_date, is_warranty, technician, status, 
        diagnosis, repair_notes, parts_used, estimated_cost, final_cost, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nextId,
        service.customer_id || null,
        service.customer_name,
        service.device_type,
        service.device_model || '',
        service.device_serial || '',
        service.problem_description,
        serviceDate,
        service.is_warranty ? 1 : 0,
        service.technician || '',
        service.status,
        service.diagnosis || '',
        service.repair_notes || '',
        partsUsed,
        service.estimated_cost || 0,
        service.final_cost || null,
        service.notes || ''
      ]
    );
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    // Log activity
    await dbUpdate(
      'INSERT INTO activity_log (action, entity_type, entity_id, details) VALUES (?, ?, ?, ?)',
      ['create', 'service', nextId, `Created new service for ${service.customer_name}`]
    );
    
    return { success: true, data: nextId, message: 'Service created successfully' };
  } catch (error) {
    console.error('Error creating service:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Get all services with pagination and filtering
export async function getServices(
  statusFilter: 'active' | 'completed' | 'all', 
  searchQuery: string = '',
  page: number = 1,
  pageSize: number = 10
): Promise<DbResult<{ services: any[]; totalPages: number }>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // Build the query conditions
    let conditions = [];
    let params = [];
    
    // Status filter
    if (statusFilter === 'active') {
      conditions.push("status IN ('pending', 'in_progress')");
    } else if (statusFilter === 'completed') {
      conditions.push("status = 'completed'");
    }
    
    // Search query
    if (searchQuery) {
      conditions.push("(customer_name LIKE ? OR id LIKE ? OR device_model LIKE ? OR device_serial LIKE ?)");
      const searchParam = `%${searchQuery}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }
    
    // Build the WHERE clause
    let whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Count total records for pagination
    const countResult = await dbQuery(
      `SELECT COUNT(*) as total FROM services ${whereClause}`,
      params
    );
    
    if (!countResult.success || !countResult.data) {
      return { success: false, error: countResult.error || 'Failed to count services' };
    }
    
    const totalRecords = countResult.data[0].total;
    const totalPages = Math.ceil(totalRecords / pageSize);
    
    // Calculate offset for pagination
    const offset = (page - 1) * pageSize;
    
    // Get services with pagination
    const result = await dbQuery(
      `SELECT * FROM services ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    // Parse JSON fields
    const services = (result.data || []).map((service: any) => {
      // Parse parts_used JSON if it exists and is a string
      if (service.parts_used && typeof service.parts_used === 'string') {
        try {
          service.parts_used = JSON.parse(service.parts_used);
        } catch (e) {
          service.parts_used = [];
        }
      }
      
      // Convert is_warranty from 0/1 to boolean
      service.is_warranty = Boolean(service.is_warranty);
      
      return service;
    });
    
    return { 
      success: true, 
      data: {
        services,
        totalPages
      }
    };
  } catch (error) {
    console.error('Error getting services:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Get service by ID
export async function getServiceById(id: string): Promise<DbResult<any>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await dbQuery(
      'SELECT * FROM services WHERE id = ?',
      [id]
    );
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    if (!result.data || result.data.length === 0) {
      return { success: false, error: 'Service not found' };
    }
    
    const service = result.data[0];
    
    // Parse parts_used JSON if it exists and is a string
    if (service.parts_used && typeof service.parts_used === 'string') {
      try {
        service.parts_used = JSON.parse(service.parts_used);
      } catch (e) {
        service.parts_used = [];
      }
    }
    
    // Convert is_warranty from 0/1 to boolean
    service.is_warranty = Boolean(service.is_warranty);
    
    return { success: true, data: service };
  } catch (error) {
    console.error('Error getting service by ID:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Update service
export async function updateService(id: string, service: Partial<Omit<Service, 'id'>>): Promise<DbResult<void>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // Build the update query dynamically based on provided fields
    const fields: string[] = [];
    const values: any[] = [];
    
    if (service.customer_id !== undefined) {
      fields.push('customer_id = ?');
      values.push(service.customer_id || null);
    }
    
    if (service.customer_name !== undefined) {
      fields.push('customer_name = ?');
      values.push(service.customer_name);
    }
    
    if (service.device_type !== undefined) {
      fields.push('device_type = ?');
      values.push(service.device_type);
    }
    
    if (service.device_model !== undefined) {
      fields.push('device_model = ?');
      values.push(service.device_model || '');
    }
    
    if (service.device_serial !== undefined) {
      fields.push('device_serial = ?');
      values.push(service.device_serial || '');
    }
    
    if (service.problem_description !== undefined) {
      fields.push('problem_description = ?');
      values.push(service.problem_description);
    }
    
    if (service.service_date !== undefined) {
      let serviceDate = service.service_date;
      if (serviceDate instanceof Date) {
        serviceDate = formatDate(serviceDate);
      }
      fields.push('service_date = ?');
      values.push(serviceDate);
    }
    
    if (service.is_warranty !== undefined) {
      fields.push('is_warranty = ?');
      values.push(service.is_warranty ? 1 : 0);
    }
    
    if (service.technician !== undefined) {
      fields.push('technician = ?');
      values.push(service.technician || '');
    }
    
    if (service.status !== undefined) {
      fields.push('status = ?');
      values.push(service.status);
    }
    
    if (service.diagnosis !== undefined) {
      fields.push('diagnosis = ?');
      values.push(service.diagnosis || '');
    }
    
    if (service.repair_notes !== undefined) {
      fields.push('repair_notes = ?');
      values.push(service.repair_notes || '');
    }
    
    if (service.parts_used !== undefined) {
      fields.push('parts_used = ?');
      values.push(JSON.stringify(service.parts_used));
    }
    
    if (service.estimated_cost !== undefined) {
      fields.push('estimated_cost = ?');
      values.push(service.estimated_cost);
    }
    
    if (service.final_cost !== undefined) {
      fields.push('final_cost = ?');
      values.push(service.final_cost);
    }
    
    if (service.notes !== undefined) {
      fields.push('notes = ?');
      values.push(service.notes || '');
    }
    
    if (fields.length === 0) {
      return { success: true, message: 'No changes to update' };
    }
    
    // Update the updated_at timestamp
    fields.push('updated_at = CURRENT_TIMESTAMP');
    
    // Add ID to values
    values.push(id);
    
    const query = `UPDATE services SET ${fields.join(', ')} WHERE id = ?`;
    
    const result = await dbUpdate(query, values);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    // Log activity
    await dbUpdate(
      'INSERT INTO activity_log (action, entity_type, entity_id, details) VALUES (?, ?, ?, ?)',
      ['update', 'service', id, `Updated service ${id}`]
    );
    
    return { success: true, message: 'Service updated successfully' };
  } catch (error) {
    console.error('Error updating service:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Delete service
export async function deleteService(id: string): Promise<DbResult<void>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await dbUpdate(
      'DELETE FROM services WHERE id = ?',
      [id]
    );
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    // Log activity
    await dbUpdate(
      'INSERT INTO activity_log (action, entity_type, entity_id, details) VALUES (?, ?, ?, ?)',
      ['delete', 'service', id, `Deleted service ${id}`]
    );
    
    return { success: true, message: 'Service deleted successfully' };
  } catch (error) {
    console.error('Error deleting service:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Get service history for a customer or device
export async function getServiceHistory(
  searchType: 'customer' | 'device',
  searchValue: string
): Promise<DbResult<any[]>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    let query = 'SELECT * FROM services WHERE ';
    let params = [];
    
    if (searchType === 'customer') {
      query += 'customer_name LIKE ? OR customer_id = ?';
      params.push(`%${searchValue}%`, searchValue);
    } else {
      query += 'device_serial LIKE ? OR (device_type LIKE ? AND device_model LIKE ?)';
      params.push(`%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`);
    }
    
    query += ' ORDER BY service_date DESC';
    
    const result = await dbQuery(query, params);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    // Parse JSON fields
    const services = (result.data || []).map((service: any) => {
      // Parse parts_used JSON if it exists and is a string
      if (service.parts_used && typeof service.parts_used === 'string') {
        try {
          service.parts_used = JSON.parse(service.parts_used);
        } catch (e) {
          service.parts_used = [];
        }
      }
      
      // Convert is_warranty from 0/1 to boolean
      service.is_warranty = Boolean(service.is_warranty);
      
      return service;
    });
    
    return { success: true, data: services };
  } catch (error) {
    console.error('Error getting service history:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}
