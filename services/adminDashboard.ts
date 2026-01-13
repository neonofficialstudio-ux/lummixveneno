import { supabase } from './supabase';

export async function fetchAdminDashboard(days = 7) {
  const { data, error } = await supabase.rpc('get_admin_dashboard', { p_days: days });
  if (error) throw error;
  return data;
}
