import React, { useEffect } from 'react';
import { isEmpty, uniq } from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination } from '@material-ui/lab';
import {
  fetchExperts,
  setExpertsDirectionsFilter,
  setExpertsPage,
  setExpertsRegionsFilter,
} from '../store/expertsSlice';
import { RootStateType } from '../../../store/rootReducer';
import ExpertsList from '../../../lib/components/ExpertsList';
import LoadingInfo from '../../../lib/components/LoadingInfo';
import { useStyles } from '../styles/ExpertsView.styles';
import { FilterTypeEnum } from '../../../lib/types';
import { selectExpertsByIds } from '../../../store/selectors';
import { ICheckBoxFormState } from '../../../lib/components/CheckBoxFilterForm';
import CheckBoxDropdownFilterForm from '../../../lib/components/СheckBoxDropdownFilterForm';
import useEffectExceptOnMount from '../../../lib/hooks/useEffectExceptOnMount';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const PAGE_QUERY = 'page';
const REGIONS_QUERY = 'regions';
const DIRECTIONS_QUERY = 'directions';

const ExpertsView: React.FC = () => {
  const classes = useStyles();
  const query = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    expertIds,
    meta: { totalPages, pageNumber, loading },
  } = useSelector((state: RootStateType) => state.experts.experts);

  const experts = selectExpertsByIds(expertIds);

  const regions = useSelector(
    (state: RootStateType) => state.properties?.regions,
  );

  const directions = useSelector(
    (state: RootStateType) => state.properties?.directions,
  );

  const fetchMaterials = () => {
    const pageQuery = Number(query.get(PAGE_QUERY));
    const regionsQuery = query.get(REGIONS_QUERY);
    const directionsQuery = query.get(DIRECTIONS_QUERY);

    const isPage = pageQuery ? pageQuery - 1 : 0;
    dispatch(setExpertsPage(isPage));

    const regionsType = {};
    regionsQuery?.split(',').forEach((el) => {
      regionsType[el] = true;
    });
    dispatch(setExpertsRegionsFilter({ value: regionsType }));

    const directionsType = {};
    directionsQuery?.split(',').forEach((el) => {
      directionsType[el] = true;
    });
    dispatch(setExpertsDirectionsFilter({ value: directionsType }));

    dispatch(fetchExperts());
  };

  const setFilters = (
    checked: ICheckBoxFormState,
    filterType: FilterTypeEnum,
  ) => {
    const checkedIds = Object.keys(checked).filter((key) => checked[key]);
    const queryType = filterType.toLowerCase();
    const isQuerySame = uniq(Object.values(checked)).length === 1;

    query.set(queryType, checkedIds.join(','));
    if (!checkedIds.length || isQuerySame) {
      query.delete(queryType);
    }

    query.set(PAGE_QUERY, '1');
    history.push({
      search: query.toString(),
    });
  };

  const handlePageChange = (_, newPage: number) => {
    query.set(PAGE_QUERY, String(newPage));
    history.push({
      search: query.toString(),
    });
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffectExceptOnMount(() => {
    fetchMaterials();
  }, [
    query.get(PAGE_QUERY),
    query.get(REGIONS_QUERY),
    query.get(DIRECTIONS_QUERY),
  ]);

  const expertsPropertiesLoaded = !!regions.length && !!directions.length;

  const correctPageNumber = pageNumber === 0 ? 1 : pageNumber + 1;

  const selectedRegionsString = query.get(REGIONS_QUERY)?.split(',');
  const selectedDirectionsString = query.get(DIRECTIONS_QUERY)?.split(',');

  const selectedRegionsFilter = regions?.filter((post) =>
    selectedRegionsString?.includes(post.id.toString()),
  );
  const selectedDirectionsFilter = directions?.filter((post) =>
    selectedDirectionsString?.includes(post.id.toString()),
  );

  const initialRegionsFilter = !isEmpty(selectedRegionsFilter)
    ? selectedRegionsFilter
    : undefined;
  const initialDirectionsFilter = !isEmpty(selectedDirectionsString)
    ? selectedDirectionsFilter
    : undefined;

  return (
    <>
      {expertsPropertiesLoaded && (
        <Grid container direction="column">
          <CheckBoxDropdownFilterForm
            onFormChange={setFilters}
            possibleFilters={regions}
            selectedFilters={initialRegionsFilter}
            filterTitle="Регіони: "
            filterType={FilterTypeEnum.REGIONS}
          />
          <CheckBoxDropdownFilterForm
            onFormChange={setFilters}
            possibleFilters={directions}
            selectedFilters={initialDirectionsFilter}
            filterTitle="Напрямки: "
            filterType={FilterTypeEnum.DIRECTIONS}
          />
        </Grid>
      )}
      <Box mt={2}>
        {loading === 'pending' ? (
          <Grid
            container
            direction="column"
            alignItems="center"
            className={classes.loading}
          >
            <LoadingInfo loading={loading} />
          </Grid>
        ) : (
          <>
            <Grid container spacing={4} direction="row">
              <ExpertsList experts={experts} />
            </Grid>
            <Box mt={2} mb={2}>
              <Grid
                container
                spacing={2}
                direction="column"
                alignItems="center"
              >
                <Pagination
                  count={totalPages}
                  page={correctPageNumber}
                  showFirstButton
                  showLastButton
                  onChange={handlePageChange}
                />
              </Grid>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default ExpertsView;
