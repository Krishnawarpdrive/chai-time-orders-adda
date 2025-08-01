
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Staff, StaffPerformance, CreateStaffData } from '@/types/staff';
import { useToast } from '@/hooks/use-toast';

export const useStaff = () => {
  return useQuery({
    queryKey: ['staff'],
    queryFn: async (): Promise<Staff[]> => {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching staff:', error);
        throw error;
      }

      return (data || []).map(staff => ({
        ...staff,
        status: staff.status as 'active' | 'inactive' | 'terminated'
      }));
    },
  });
};

export const useStaffPerformance = (staffId?: string) => {
  return useQuery({
    queryKey: ['staff-performance', staffId],
    queryFn: async (): Promise<StaffPerformance[]> => {
      let query = supabase
        .from('staff_performance')
        .select('*')
        .order('date', { ascending: false });

      if (staffId) {
        query = query.eq('staff_id', staffId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching staff performance:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useStaffWithPerformance = () => {
  return useQuery({
    queryKey: ['staff-with-performance'],
    queryFn: async () => {
      const { data: staff, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (staffError) {
        console.error('Error fetching staff:', staffError);
        throw staffError;
      }

      // Get today's performance for each staff member
      const { data: performance, error: performanceError } = await supabase
        .from('staff_performance')
        .select('*')
        .eq('date', new Date().toISOString().split('T')[0]);

      if (performanceError) {
        console.error('Error fetching performance:', performanceError);
        throw performanceError;
      }

      // Merge staff with their performance data
      const staffWithPerformance = staff?.map(staffMember => {
        const staffPerformance = performance?.find(p => p.staff_id === staffMember.id);
        return {
          ...staffMember,
          status: staffMember.status as 'active' | 'inactive' | 'terminated',
          performance: staffPerformance
        };
      }) || [];

      return staffWithPerformance;
    },
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (staffData: CreateStaffData): Promise<Staff> => {
      const { data, error } = await supabase
        .from('staff')
        .insert([staffData])
        .select()
        .single();

      if (error) {
        console.error('Error creating staff:', error);
        throw error;
      }

      return {
        ...data,
        status: data.status as 'active' | 'inactive' | 'terminated'
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['staff-with-performance'] });
      toast({
        title: 'Success',
        description: 'Staff member added successfully',
      });
    },
    onError: (error) => {
      console.error('Create staff error:', error);
      toast({
        title: 'Error',
        description: 'Failed to add staff member',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Staff> }): Promise<Staff> => {
      const { data, error } = await supabase
        .from('staff')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating staff:', error);
        throw error;
      }

      return {
        ...data,
        status: data.status as 'active' | 'inactive' | 'terminated'
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['staff-with-performance'] });
      toast({
        title: 'Success',
        description: 'Staff member updated successfully',
      });
    },
    onError: (error) => {
      console.error('Update staff error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update staff member',
        variant: 'destructive',
      });
    },
  });
};
