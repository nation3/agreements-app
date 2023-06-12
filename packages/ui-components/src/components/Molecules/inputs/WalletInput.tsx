import React, { InputHTMLAttributes, useRef, useCallback, useEffect, useMemo, useState } from "react";
import cx from "classnames";

import { Body3 } from "../../atoms";
import { isAddress, isEnsDomain, shortenAddress } from "../../../utils/addresses";
import { ActionLabel } from "../labels";

export interface WalletInputValue {
	ensName: string;
	address: string;
};

type DisplayMode = 'address' | 'ensName';

export interface WalletInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
	value: WalletInputValue;
	onValueChange: (value: WalletInputValue) => void;
	status?: "default" | "success" | "warning" | "error";
	focusColor?: string;
	label?: string | undefined;
	disabled?: boolean;
	resolveEnsNameFromAddress?: (address: string) => Promise<string | null>;
	resolveAddressFromEnsName?: (ensName: string) => Promise<string | null>;
	onEnsResolved?: (ensName: string) => void;
	onAddressValidated?: (address: string) => void;
	onResolvingError?: (error: Error) => void;
}

// FIXME: Got this component working from Aragon's design system, it needs some cleanup
export const WalletInput = React.forwardRef<HTMLInputElement, WalletInputProps>(
  (
    {
      status = 'default',
      value,
	  label,
	  focusColor,
      disabled,
      onFocus,
      // onWheel,
      onValueChange,
      resolveEnsNameFromAddress,
      resolveAddressFromEnsName,
      onAddressValidated,
      onEnsResolved,
      onResolvingError,
      ...props
    },
    ref
  ) => {
	const inputRef = useRef<HTMLInputElement>(null);
    const wasNotEditingRef = useRef(true);

    // const [showAlert, setShowAlert] = useState(false);
    // const [alertLabel, setAlertLabel] = useState('');

    // const [truncate, setTruncate] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [displayMode, setDisplayMode] = useState<DisplayMode>(() =>
      value.address ? 'address' : 'ensName'
    );
    // const [initialHeight, setInitialHeight] = useState(0);
    const [resolvedValues, setResolvedValues] = useState<WalletInputValue>();

    const canToggle = !!value.address && !!value.ensName;
    // const togglerLabel = displayMode === 'address' ? 'ENS' : '0x…';
    const ensSupported =
      !!resolveAddressFromEnsName && !!resolveEnsNameFromAddress;

    // holds the full format of the potentially shortened value in the input
    const fullValue: string = useMemo(() => {
      return String(displayMode === 'address' ? value.address : value.ensName);
    }, [displayMode, value.address, value.ensName]);

    // Only show see on scan button if the input is valid
	/*
    const showExternalButton =
      blockExplorerURL && (IsAddress(fullValue) || isEnsDomain(fullValue));
    const adornmentsDisabled = disabled && !fullValue;
	*/

    // This displays the truncated address/ens when the value is not being
    // edited by the user, or in the case of ens, when the length of the name
    // would have otherwise overflown
    const displayedValue = useMemo(() => {
      if (isEditing) return fullValue;

      if (displayMode === 'address') return shortenAddress(value.address);

      // Get the current height and compare it with the initial height.
      // because the input row is set to 1, when the input gets filled,
      // the height is being adjusted so that the overflow is not hidden.
      // The height being modified means that the text would have otherwise
      // wrapped/overflown.
	  /*
      if (getTextAreaHeight(textareaRef.current) > initialHeight || truncate) {
        setTruncate(false);
        return shortenENS(value.ensName);
      } else {
        return value.ensName as string;
	  }
	*/
    return value.ensName as string;
    }, [
      displayMode,
      fullValue,
      // initialHeight,
      isEditing,
      // truncate,
      value.address,
      value.ensName,
    ]);

    /*************************************************
     *               Hooks & Effects                 *
     *************************************************/
    useEffect(() => {
      async function resolveValues() {
        const newValue = {...value};

        if (displayMode === 'address') {
          try {
            // only fetch when it's a valid address
            if (isAddress(fullValue)) {
              onAddressValidated?.(fullValue);

              // resolve ens name
              const result = await resolveEnsNameFromAddress?.(fullValue);
              newValue.ensName = result?.toLowerCase() ?? '';
            }
          } catch (error) {
            onResolvingError?.(error as Error);
            newValue.ensName = '';
          }
        } else if (resolveAddressFromEnsName) {
          try {
            // only fetch when it's a valid ens
            if (isEnsDomain(fullValue)) {
              const result = await resolveAddressFromEnsName?.(fullValue);
              newValue.address = result?.toLowerCase() ?? '';

              // wait until the corresponding ens value is resolved
              newValue.address && onEnsResolved?.(value.address);
            }
          } catch (error) {
            onResolvingError?.(error as Error);
            newValue.address = '';
          }
        }

		const resolvedType = displayMode === 'address' ? 'ensName' : 'address';
		if (!resolvedValues || newValue[resolvedType] !== resolvedValues[resolvedType]) {
        	setResolvedValues(newValue);
		}

		/* If the new values are different from the current ones, update the controller */
		if (newValue[resolvedType] !== value[resolvedType])
		  onValueChange(newValue);
      }

      if (
        ensSupported && // network supports ens
        displayMode && // not initial state/render
        value[displayMode] && // the displayed value isn't empty
        JSON.stringify(value) !== JSON.stringify(resolvedValues) // value and resolved values don't match
      )
        resolveValues();
    }, [
      displayMode,
      ensSupported,
      fullValue,
      onValueChange,
      onAddressValidated,
      onEnsResolved,
      onResolvingError,
      resolveAddressFromEnsName,
      resolveEnsNameFromAddress,
      resolvedValues,
      value,
    ]);

	/*
    useEffect(() => {
      if (resolvedValues) {
        // update the controller value if it is not the same as the resolved values;
        // this works in conjunction with the previous hook
        const resolvedType = displayMode === 'address' ? 'ensName' : 'address';
        if (value[resolvedType] !== resolvedValues[resolvedType])
          onValueChange(resolvedValues);
      }
    }, [displayMode, onValueChange, resolvedValues, value]);
	*/

    // resolve the forwarded ref and local ref
    useEffect(() => {
      if (typeof ref === 'function') {
        ref(inputRef.current);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current =
          inputRef.current;
      }
    }, [ref]);

    // adjust textarea height so that it grows as filled
	/*
    useEffect(() => {
      if (textareaRef.current) {
        // get the initial height of the text area
        if (textareaRef.current.style.height !== null) {
          setInitialHeight(prev => {
            if (prev) return prev;
            else return getTextAreaHeight(textareaRef.current);
          });
        }

        // adjust height so input grows as filled
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height =
          textareaRef.current.scrollHeight + 'px';
      }
    }, [isEditing, value, displayedValue]);
	*/

    // select text on focus, this needs to be done here instead of onFocus because
    // updating the isEditing state will remove the focus when the component re-renders
    useEffect(() => {
      if (wasNotEditingRef && isEditing) {
        inputRef.current?.select();
      }
    }, [isEditing]);

	/*
    useEffect(() => {
      if (!isEditing) {
        if (getTextAreaHeight(textareaRef.current) > initialHeight) {
          setTruncate(true);
        }
      }
    }, [initialHeight, isEditing, displayedValue]);
	*/

    /*************************************************
     *             Callbacks and handlers            *
     *************************************************/
    /*
    const alert = useCallback((label: string) => {
      setAlertLabel(label);
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 1200);
    }, []);
    */

    // Show ens or address
    const toggleDisplayMode = useCallback(
      // (event: React.MouseEvent<HTMLDivElement>) => {
      () => {
        const newDisplayMode: DisplayMode =
          displayMode === 'address' ? 'ensName' : 'address';

        setDisplayMode(newDisplayMode);
        // onToggleButtonClick?.(event);
      },
    //   [displayMode, onToggleButtonClick]
      [displayMode]
    );

    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsEditing(false);
        wasNotEditingRef.current = false;
      },
      []
    );

    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        setIsEditing(true);
        wasNotEditingRef.current = true;
        onFocus?.(event);
      },
      [onFocus]
    );

    /*
    const handleOnWheel = useCallback(
      (event: React.WheelEvent<HTMLInputElement>) => {
        event.preventDefault();
        event.currentTarget.blur();
        onWheel?.(event);
      },
      [onWheel]
    );
    */

    const setValue = useCallback(
      (addressOrEns: string) => {
        setResolvedValues(undefined);

        if (addressOrEns === '') {
          return {ensName: '', address: ''};
        }

        // set proper display mode based on the value
        if (
          isAddress(addressOrEns) ||
          !ensSupported ||
          addressOrEns.startsWith('0x')
        ) {
          setDisplayMode('address');
          return {ensName: '', address: addressOrEns.toLowerCase()};
        } else {
          setDisplayMode('ensName');
          return {address: '', ensName: addressOrEns.toLowerCase()};
        }
      },
      [ensSupported]
    );

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange(setValue(event.target.value));
      },

      [onValueChange, setValue]
    );

    /*
    const handleClearInput = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        onValueChange(setValue(''));
        setIsEditing(true);
        alert('Cleared');
        // onClearButtonClick?.(event);
      },
    //   [alert, onClearButtonClick, onValueChange, setValue]
      [alert, onValueChange, setValue]
    );
    */

    /*
    const handlePasteFromClipboard = useCallback(
      async (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
          const clipboardData = await navigator.clipboard.readText();

          setIsEditing(false);
          onValueChange(setValue(clipboardData));
          alert('Pasted');
        //   onPasteButtonClick?.(event);
        } catch (err) {
          console.error('Failed to read clipboard contents: ', err);
        }
      },
    //   [alert, onPasteButtonClick, onValueChange, setValue]
      [alert, onValueChange, setValue]
    );
    */

    /*
    const handleCopyToClipboard = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        navigator.clipboard.writeText(
          (displayMode === 'address' ? value.address : value.ensName) || ''
        );
        alert('Copied');
        // onCopyButtonClick?.(event);
      },
    //   [alert, displayMode, onCopyButtonClick, value.address, value.ensName]
      [alert, displayMode, value.address, value.ensName]
    ); 
    */

	const DisplayModeToggle = useMemo(() => {
		if (!ensSupported) return <></>;
		return (
			<ActionLabel
				color="neutral-500"
				border="neutral-300"
				background="white"
				className="transition"
				onClick={toggleDisplayMode}
			>
				{displayMode === 'address' ? 'ENS' : '0x...'}
			</ActionLabel>
		)
	}, [ensSupported, displayMode, toggleDisplayMode]);

	const statusClass = !disabled && cx({
		"border-neutral-300": status === 'default',
		"border-semantic-success": status === 'success',
		"border-semantic-warning": status === 'warning',
		"border-semantic-error": status === 'error',
	});

	return (
		<div>
			{label && <Body3 color="neutral-600" className="mb-2">{label}</Body3>}
			<div
				className={cx(
					"flex relative items-center justify-center w-full p-3 border-2 rounded-base outline-none transition-all",
					disabled ? "bg-neutral-200 text-neutral-500" : "bg-white text-neutral-800",
					statusClass,
					`focus:ring-${focusColor} focus:border-${focusColor}`
				)}
			>
				<input
					{...props}
					type="text"
					id="wallet-input"
					className={cx(
						"w-full appearance-none bg-transparent border-none outline-none resize-none p-0 m-0",
						"font-inherit",
						"disabled:cursor-not-allowed"
					)}
					disabled={disabled}
					value={displayedValue}
					onChange={handleChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
				/>
				{displayedValue && !isEditing && canToggle && (
					<span className="absolute right-0 top-1/2 -translate-y-1/2 mr-3">{DisplayModeToggle}</span>
				)}
			</div>
		</div>
	);
});

WalletInput.displayName = 'WalletInput';