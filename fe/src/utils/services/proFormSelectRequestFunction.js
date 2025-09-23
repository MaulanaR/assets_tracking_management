import { fetchSelect } from './fetchSelect';

// Helper function untuk create request function
const proFormSelectRequestFunction = ({
  url,
  key = 'select option',
  labelKey = 'name',
  valueKey = 'id',
}) => {
  return async (params) => {
    try {
      const response = await fetchSelect({
        pageParam: 1,
        queryKey: [url, key, params.keyWords || ''],
        url: url,
        search: params.keyWords || '',
      });

      return response.data.map((item) => ({
        label: item[labelKey],
        value: item[valueKey],
      }));
    } catch (error) {
      console.error('Error fetching options:', error);
      return [];
    }
  };
};

export default proFormSelectRequestFunction;
