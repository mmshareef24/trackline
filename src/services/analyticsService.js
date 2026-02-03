import { supabase } from '../utils/supabaseClient';

export const getTeamsPerformance = async (orgId) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  // 1. Fetch departments
  const { data: departments, error: deptError } = await supabase
    .from('departments')
    .select('id, name')
    .eq('organization_id', orgId);
  if (deptError) throw deptError;

  // 2. Fetch users to count members per department
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id, department_id')
    .eq('organization_id', orgId);
  if (userError) throw userError;

  // 3. Fetch objectives to calculate performance
  const { data: objectives, error: objError } = await supabase
    .from('objectives')
    .select('id, department_id, status, progress')
    .eq('organization_id', orgId);
  if (objError) throw objError;

  // 4. Fetch Key Results
  const objectiveIds = objectives.map(o => o.id);
  let keyResults = [];
  if (objectiveIds.length > 0) {
      const { data: krs, error: krError } = await supabase
        .from('key_results')
        .select('id, objective_id, status')
        .in('objective_id', objectiveIds);
      if (krError) throw krError;
      keyResults = krs;
  }

  // Aggregate data
  const result = departments.map(dept => {
    const deptUsers = users.filter(u => u.department_id === dept.id);
    const deptObjectives = objectives.filter(o => o.department_id === dept.id);
    
    // Filter KRs that belong to objectives of this department
    const deptObjectiveIds = new Set(deptObjectives.map(o => o.id));
    const deptKRs = keyResults.filter(kr => deptObjectiveIds.has(kr.objective_id));

    const totalObjectives = deptObjectives.length;
    const completedObjectives = deptObjectives.filter(o => o.status === 'completed').length;
    
    const totalKRs = deptKRs.length;
    const completedKRs = deptKRs.filter(kr => kr.status === 'completed').length;

    // Calculate performance (avg objective progress)
    const avgProgress = totalObjectives > 0 
      ? deptObjectives.reduce((sum, obj) => sum + (obj.progress || 0), 0) / totalObjectives
      : 0;

    return {
      id: dept.id,
      name: dept.name,
      members: deptUsers.length,
      performance: Math.round(avgProgress),
      completedObjectives,
      totalObjectives,
      completedKRs,
      totalKRs,
      checkInRate: 0 // Placeholder
    };
  });

  return result;
};
