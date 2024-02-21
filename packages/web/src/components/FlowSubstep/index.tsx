import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import type { IStep, ISubstep } from 'types';
import isEqual from 'lodash/isEqual';

import { EditorContext } from 'contexts/Editor';
import FlowSubstepTitle from 'components/FlowSubstepTitle';
import InputCreator from 'components/InputCreator';
import FilterConditions from './FilterConditions';

type FlowSubstepProps = {
  substep: ISubstep;
  expanded?: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onChange: ({ step }: { step: IStep }) => void;
  onSubmit: () => void;
  step: IStep;
};

function FlowSubstep(props: FlowSubstepProps): React.ReactElement {
  const {
    substep,
    expanded = false,
    onExpand,
    onCollapse,
    onSubmit,
    step,
    onChange,
  } = props;

  const stepRef = React.useRef(step);

  const { name, arguments: args } = substep;

  const editorContext = React.useContext(EditorContext);
  const formContext = useFormContext();
  const validationStatus = formContext.formState.isValid;

  const onToggle = expanded ? onCollapse : onExpand;

  React.useEffect(() => {
    return () => {
      if (
        !isEqual(
          stepRef.current.parameters,
          formContext.getValues('parameters')
        )
      ) {
        onChange({
          step: { ...step, parameters: formContext.getValues('parameters') },
        });
      }
    };
  }, []);

  React.useEffect(() => {
    stepRef.current = step;
  }, [step]);

  return (
    <React.Fragment>
      <FlowSubstepTitle
        expanded={expanded}
        onClick={onToggle}
        title={name}
        valid={validationStatus}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <ListItem
          sx={{
            pt: 2,
            pb: 3,
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'relative',
          }}
        >
          {!!args?.length && (
            <Stack width="100%" spacing={2}>
              {args.map((argument) => (
                <InputCreator
                  key={argument.key}
                  schema={argument}
                  namePrefix="parameters"
                  stepId={step.id}
                  disabled={editorContext.readOnly}
                  showOptionValue={true}
                />
              ))}
            </Stack>
          )}

          {step.appKey === 'filter' && <FilterConditions stepId={step.id} />}

          <Button
            fullWidth
            variant="contained"
            onClick={onSubmit}
            sx={{ mt: 2 }}
            disabled={!validationStatus || editorContext.readOnly}
            type="submit"
            data-test="flow-substep-continue-button"
          >
            Continue
          </Button>
        </ListItem>
      </Collapse>
    </React.Fragment>
  );
}

export default FlowSubstep;
