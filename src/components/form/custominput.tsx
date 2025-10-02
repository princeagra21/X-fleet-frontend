"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Check, ChevronsUpDown, Command } from "lucide-react";
import * as React from "react";
import * as FaIcons from "react-icons/fa"; // react-icons/fa for icon-by-name
import { CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import CompactCombobox, {
  type ComboOption as SelectOption, // ✅ use your existing exported type
} from "./compactcombobox";

/**
 * CustomInput — single-size, premium, minimal
 * -------------------------------------------
 * - One consistent size & look (≈10–12% tighter)
 * - Icon-by-name: "FaUser", "FaRegEnvelope", "FaLock", "FaCheck", etc.
 * - Subtle focus aura, dark-mode ready, accessible labels/hints/errors
 */

export interface CustomInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  /** Name of icon from react-icons/fa (e.g., "FaUser", "FaRegEnvelope") */
  leadingIconName?: keyof typeof FaIcons | string;
  /** Name of icon from react-icons/fa (e.g., "FaCheck") */
  trailingIconName?: keyof typeof FaIcons | string;
  /** Optional right-side custom content (e.g., button). */
  trailing?: React.ReactNode;
  /** Show subtle focus halo */
  focusAura?: boolean;
  /** Character counter (requires maxLength) */
  showCounter?: boolean;
  /** Wrapper <div> class */
  containerClassName?: string;
  /** Icon size in px (default 14 for the premium compact look) */
  iconSize?: number;
  /** Extra classes for icon wrappers */
  iconClassName?: string;
}

/* --------------------------- Single-size tokens ---------------------------- */
const RADIUS = "rounded-xl";
const PAD_Y = "py-[7px]";
const PAD_X = "px-3";
const TEXT = "text-[13.5px]";     // input text
const LABEL = "text-[11.5px]";    // label text
const META = "text-[10.5px]";     // hint/error/counter
const GAP = "gap-1.5";
const ICON_DEFAULT = 14;

const FRAME =
  "border border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700";
const ELEV_REST = "shadow-[0_1px_0_0_rgba(0,0,0,0.04)]";
const ELEV_FOCUS = "shadow-[0_8px_22px_-20px_rgba(0,0,0,0.30)]";
const RING_FOCUS = "ring-2 ring-neutral-900/12";
const BASE_BG_TEXT = "bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100";

/* --------------------------------- utils ---------------------------------- */
function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function resolveFaIcon(name?: keyof typeof FaIcons | string, size = ICON_DEFAULT) {
  if (!name) return null;
  const Comp = (FaIcons as any)[name as string];
  return Comp ? <Comp size={size} /> : null;
}

/* ------------------------------- CustomInput ------------------------------- */
export const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      id,
      label,
      hint,
      error,
      leadingIconName,
      trailingIconName,
      trailing,
      focusAura = true,
      showCounter = false,
      maxLength,
      className,
      containerClassName,
      disabled,
      onFocus,
      onBlur,
      iconSize = ICON_DEFAULT,
      iconClassName,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false);
    const [value, setValue] = React.useState(
      typeof props.defaultValue === "string" ? props.defaultValue : ""
    );

    const describedBy = React.useMemo(() => {
      const ids: string[] = [];
      if (error) ids.push(`${id}-error`);
      else if (hint) ids.push(`${id}-hint`);
      if (showCounter && maxLength) ids.push(`${id}-count`);
      return ids.join(" ");
    }, [error, hint, showCounter, maxLength, id]);

    const LeadingIcon = React.useMemo(
      () => resolveFaIcon(leadingIconName, iconSize),
      [leadingIconName, iconSize]
    );
    const TrailingIcon = React.useMemo(
      () => resolveFaIcon(trailingIconName, iconSize),
      [trailingIconName, iconSize]
    );

    return (
      <div className={cx("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className={cx(
              "mb-1 block select-none font-medium font-inter tracking-tight text-neutral-700 dark:text-neutral-300",
              LABEL
            )}
          >
            {label}
          </label>
        )}

        <div
          className={cx(
            "group relative isolate flex items-center",
            BASE_BG_TEXT, FRAME, RADIUS, PAD_Y, PAD_X, GAP,
            "transition-all duration-150 motion-reduce:transition-none",
            disabled && "opacity-60 cursor-not-allowed",
            focused ? cx(RING_FOCUS, ELEV_FOCUS) : ELEV_REST,
            className
          )}
        >
          {LeadingIcon && (
            <span
              className={cx(
                "inline-flex shrink-0 font-inter text-neutral-500 dark:text-neutral-400 group-focus-within:text-neutral-900 dark:group-focus-within:text-neutral-100 transition-colors",
                iconClassName
              )}
            >
              {LeadingIcon}
            </span>
          )}

          <input
            id={id}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={describedBy || undefined}
            disabled={disabled}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            onChange={(e) => setValue(e.target.value)}
            className={cx(
              "peer w-full bg-transparent font-inter outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
              TEXT
            )}
            maxLength={maxLength}
            {...props}
          />

          <div className="ml-1 -mr-1 flex items-center gap-1">
            {TrailingIcon && (
              <span
                className={cx(
                  "inline-flex shrink-0 text-neutral-500 dark:text-neutral-400 group-focus-within:text-neutral-900 dark:group-focus-within:text-neutral-100 transition-colors",
                  iconClassName
                )}
              >
                {TrailingIcon}
              </span>
            )}
            {trailing}
          </div>

          {focusAura && focused && (
            <span
              aria-hidden
              className={cx(
                "pointer-events-none absolute -inset-0.5 -z-10 rounded-[inherit]",
                "bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.05),transparent_65%)]",
                "dark:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.07),transparent_65%)]"
              )}
            />
          )}
        </div>

        <div className="mt-1 flex items-center justify-between min-h-[16px]">
          <div className={cx("font-inter leading-4", META)}>
            {error ? (
              <span id={`${id}-error`} className="text-red-500 font-medium">
                {error}
              </span>
            ) : hint ? (
              <span id={`${id}-hint`} className="text-neutral-500 dark:text-neutral-400">
                {hint}
              </span>
            ) : null}
          </div>
          {showCounter && maxLength ? (
            <span id={`${id}-count`} className={cx("font-inter text-neutral-500 tabular-nums", META)}>
              {value.length}/{maxLength}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
);
CustomInput.displayName = "CustomInput";

/* ------------------------------ PasswordInput ------------------------------ */
export function PasswordInput({
  revealLabel = "Show",
  hideLabel = "Hide",
  leadingIconName, // e.g., "FaLock"
  ...props
}: Omit<CustomInputProps, "type" | "trailing"> & {
  revealLabel?: string;
  hideLabel?: string;
}) {
  const [show, setShow] = React.useState(false);
  return (
    <CustomInput
      type={show ? "text" : "password"}
      leadingIconName={leadingIconName}
      trailing={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className={cx(
            "px-1.5 py-[3px] rounded-lg border border-neutral-200 dark:border-neutral-800",
            "font-medium font-inter text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors",
            META
          )}
          aria-label={show ? hideLabel : revealLabel}
        >
          {show ? hideLabel : revealLabel}
        </button>
      }
      {...props}
    />
  );
}



/* --------------------------------- TextArea -------------------------------- */
export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  /** Show subtle focus halo */
  focusAura?: boolean;
  /** Character counter (requires maxLength) */
  showCounter?: boolean;
  /** Wrapper <div> class */
  containerClassName?: string;
  /** Auto-grow to content (rows = minimum height) */
  autoGrow?: boolean;
}

export function TextArea({
  id,
  label,
  hint,
  error,
  focusAura = true,
  showCounter = false,
  autoGrow = false,
  maxLength,
  className,
  containerClassName,
  disabled,
  onFocus,
  onBlur,
  onChange,
  rows = 4,
  ...props
}: TextAreaProps) {
  const innerRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [focused, setFocused] = React.useState(false);
  const [value, setValue] = React.useState(
    typeof props.defaultValue === "string" ? props.defaultValue : ""
  );

  // Sync internal value if controlled from parent
  React.useEffect(() => {
    if (typeof props.value === "string") setValue(props.value);
  }, [props.value]);

  const describedBy = React.useMemo(() => {
    const ids: string[] = [];
    if (error) ids.push(`${id}-error`);
    else if (hint) ids.push(`${id}-hint`);
    if (showCounter && maxLength) ids.push(`${id}-count`);
    return ids.join(" ");
  }, [error, hint, showCounter, maxLength, id]);

  // Auto-grow height while keeping rows as minimum
  const syncHeight = React.useCallback(() => {
    if (!autoGrow || !innerRef.current) return;
    const el = innerRef.current;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [autoGrow]);

  React.useEffect(() => {
    if (autoGrow) syncHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoGrow, value]);

  return (
    <div className={cx("w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={cx(
            "mb-1 block select-none font-medium font-inter tracking-tight text-neutral-700 dark:text-neutral-300",
            LABEL
          )}
        >
          {label}
        </label>
      )}

      <div
        className={cx(
          "group relative isolate",
          BASE_BG_TEXT,
          FRAME,
          RADIUS,
          focused ? cx(RING_FOCUS, ELEV_FOCUS) : ELEV_REST,
          "transition-all duration-150 motion-reduce:transition-none",
          disabled && "opacity-60 cursor-not-allowed",
          className
        )}
      >
        <textarea
          id={id}
          ref={innerRef}
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          disabled={disabled}
          rows={rows}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          onChange={(e) => {
            setValue(e.target.value);
            if (autoGrow) syncHeight();
            onChange?.(e);
          }}
          className={cx(
            "w-full bg-transparent font-inter outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
            PAD_X,
            PAD_Y,
            TEXT,
            // keep layout tight; change to 'resize-y' if you want manual vertical resize
            "resize-none"
          )}
          maxLength={maxLength}
          {...props}
        />

        {focusAura && focused && (
          <span
            aria-hidden
            className={cx(
              "pointer-events-none absolute -inset-0.5 -z-10 rounded-[inherit]",
              "bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.05),transparent_65%)]",
              "dark:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.07),transparent_65%)]"
            )}
          />
        )}
      </div>

      <div className="mt-1 flex items-center justify-between min-h-[16px]">
        <div className={cx("font-inter leading-4", META)}>
          {error ? (
            <span id={`${id}-error`} className="text-red-500 font-medium">
              {error}
            </span>
          ) : hint ? (
            <span id={`${id}-hint`} className="text-neutral-500 dark:text-neutral-400">
              {hint}
            </span>
          ) : null}
        </div>
        {showCounter && maxLength ? (
          <span
            id={`${id}-count`}
            className={cx("font-inter text-neutral-500 tabular-nums", META)}
            aria-live="polite"
          >
            {value.length}/{maxLength}
          </span>
        ) : null}
      </div>
    </div>
  );
}


/* -------------------------------- NumberInput ------------------------------- */
export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  /** Show subtle focus halo */
  focusAura?: boolean;
  /** Wrapper <div> class */
  containerClassName?: string;
  /** Step amount for increment/decrement (default 1) */
  step?: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
}

export function NumberInput({
  id,
  label,
  hint,
  error,
  focusAura = true,
  containerClassName,
  className,
  disabled,
  onFocus,
  onBlur,
  onChange,
  step = 1,
  min,
  max,
  ...props
}: NumberInputProps) {
  // Extract and omit value/defaultValue from being spread to the native input
  const { defaultValue, value: controlledValue, ...restProps } = props as {
    defaultValue?: string | number;
    value?: string | number;
  } & typeof props;
  const ref = React.useRef<HTMLInputElement>(null);
  const [focused, setFocused] = React.useState(false);
  const [value, setValue] = React.useState(
    typeof defaultValue !== "undefined"
      ? String(defaultValue)
      : typeof controlledValue !== "undefined"
      ? String(controlledValue)
      : ""
  );

  // Keep internal state in sync if a controlled value is provided
  React.useEffect(() => {
    if (typeof controlledValue !== "undefined") setValue(String(controlledValue));
  }, [controlledValue]);

  const describedBy = React.useMemo(() => {
    const ids: string[] = [];
    if (error) ids.push(`${id}-error`);
    else if (hint) ids.push(`${id}-hint`);
    return ids.join(" ");
  }, [error, hint, id]);

  const nudge = (dir: 1 | -1) => {
    const current = parseFloat(value as string) || 0;
    const next = current + dir * (step || 1);
    const clamped =
      typeof min === "number" && next < min
        ? min
        : typeof max === "number" && next > max
        ? max
        : next;
    setValue(String(clamped));
    if (ref.current) {
      const event = new Event("input", { bubbles: true });
      ref.current.value = String(clamped);
      ref.current.dispatchEvent(event);
    }
  };

  return (
    <div className={cx("w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={cx(
            "mb-1 block select-none font-medium font-inter tracking-tight text-neutral-700 dark:text-neutral-300",
            LABEL
          )}
        >
          {label}
        </label>
      )}

      <div
        className={cx(
          "group relative isolate flex items-center",
          BASE_BG_TEXT,
          FRAME,
          RADIUS,
          PAD_Y,
          PAD_X,
          GAP,
          "transition-all duration-150 motion-reduce:transition-none",
          disabled && "opacity-60 cursor-not-allowed",
          focused ? cx(RING_FOCUS, ELEV_FOCUS) : ELEV_REST,
          className
        )}
      >
        <button
          type="button"
          onClick={() => nudge(-1)}
          className={cx(
            META,
            "px-2 py-[2px] rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900"
          )}
          aria-label="Decrease value"
        >
          −
        </button>

        <input
          id={id}
          ref={ref}
          type="number"
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          disabled={disabled}
          value={value}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          onChange={(e) => {
            setValue(e.target.value);
            onChange?.(e);
          }}
          className={cx(
            "peer w-full bg-transparent font-inter outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-center",
            TEXT
          )}
          {...restProps}
        />

        <button
          type="button"
          onClick={() => nudge(1)}
          className={cx(
            META,
            "px-2 py-[2px] rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900"
          )}
          aria-label="Increase value"
        >
          +
        </button>

        {focusAura && focused && (
          <span
            aria-hidden
            className={cx(
              "pointer-events-none absolute -inset-0.5 -z-10 rounded-[inherit]",
              "bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.05),transparent_65%)]",
              "dark:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.07),transparent_65%)]"
            )}
          />
        )}
      </div>

      <div className="mt-1 min-h-[16px]">
        <div className={cx("font-inter leading-4", META)}>
          {error ? (
            <span id={`${id}-error`} className="text-red-500 font-medium">
              {error}
            </span>
          ) : hint ? (
            <span id={`${id}-hint`} className="text-neutral-500 dark:text-neutral-400">
              {hint}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- SelectInput ------------------------------ */
export interface SelectInputProps {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
  disabled?: boolean;

  options: SelectOption[];
  value?: string;
  onValueChange?: (v: string) => void;
  placeholder?: string;
  emptyText?: string;
  inputPlaceholder?: string;
  align?: "start" | "center" | "end";
  sideOffset?: number;

  /** Optional leading icon (same API as CustomInput) */
  leadingIconName?: keyof typeof FaIcons | string;
  iconSize?: number;
  iconClassName?: string;
}

export function SelectInput({
  id,
  label,
  hint,
  error,
  containerClassName,
  disabled,
  options,
  value,
  onValueChange,
  placeholder = "Select",
  emptyText = "No results",
  inputPlaceholder = "Search...",
  align = "start",
  sideOffset = 4,
  leadingIconName,
  iconSize = ICON_DEFAULT,
  iconClassName,
}: SelectInputProps) {
  const LeadingIcon = React.useMemo(
    () => resolveFaIcon(leadingIconName, iconSize),
    [leadingIconName, iconSize]
  );

  // Compute left padding: keep compact density even when there's no icon
  const leftPadNoIcon = PAD_X || "px-3"; // fallback if PAD_X not in scope
  const leftPadWithIcon = "!pl-10";      // reserves room for 18px icon + gap

  return (
    <div className={cx("w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={cx(
            "mb-1 block select-none font-medium font-inter tracking-tight text-neutral-700 dark:text-neutral-300",
            LABEL
          )}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* Render icon slot only when provided */}
        {LeadingIcon && (
          <span
            aria-hidden
            className={cx(
              "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2",
              "inline-grid place-items-center w-[18px] h-[18px]",
              "text-neutral-500 dark:text-neutral-400",
              iconClassName
            )}
          >
            {LeadingIcon}
          </span>
        )}

        <CompactCombobox
          value={value}
          onChange={(v) => onValueChange?.(v)}
          options={options}
          placeholder={placeholder}
          emptyText={emptyText}
          inputPlaceholder={inputPlaceholder}
          disabled={disabled}
          align={align}
          sideOffset={sideOffset}
          /* Popover panel */
          className={cx(
            "rounded-md border bg-white text-neutral-900 shadow-md",
            "dark:bg-neutral-950 dark:text-neutral-100 dark:border-neutral-800"
          )}
          /* Trigger button — force padding so text never overlaps icon or chevrons */
          buttonClassName={cx(
            "w-full justify-between font-inter leading-tight",
            TEXT,
            RADIUS,
            ELEV_REST,
            "border border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700",
            "bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100",
            // compact vertical rhythm
            PAD_Y,
            // reset shadcn default padding, then add ours
            "!px-4",
            LeadingIcon ? leftPadWithIcon : leftPadNoIcon, // ✅ left space depends on icon presence
            "!pr-8" // ✅ right space for chevrons (and future trailing content)
          )}
        />
      </div>

      <div className="mt-1 min-h-[16px]">
        <div className={cx("font-inter leading-4", META)}>
          {error ? (
            <span id={`${id}-error`} className="text-red-500 font-medium">
              {error}
            </span>
          ) : hint ? (
            <span id={`${id}-hint`} className="text-neutral-500 dark:text-neutral-400">
              {hint}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}



/* -------------------------------- ToggleSwitch ----------------------------- */
export interface ToggleSwitchProps {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;

  checked?: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  /** Subtle focus halo on the switch itself */
  focusAura?: boolean;
}

export function ToggleSwitch({
  id,
  label,
  hint,
  error,
  containerClassName,
  checked = false,
  onChange,
  disabled,
  focusAura = true,
}: ToggleSwitchProps) {
  const [focused, setFocused] = React.useState(false);

  const toggle = React.useCallback(() => {
    if (disabled) return;
    onChange?.(!checked);
  }, [checked, disabled, onChange]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    } else if (e.key === "ArrowRight") {
      if (!checked) onChange?.(true);
    } else if (e.key === "ArrowLeft") {
      if (checked) onChange?.(false);
    }
  };

  return (
    <div className={cx("w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={cx(
            "mb-1 block select-none font-medium font-inter tracking-tight text-neutral-700 dark:text-neutral-300",
            LABEL
          )}
        >
          {label}
        </label>
      )}

      {/* Bare switch — no border/frame wrapper, keeps premium density */}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cx(
          "relative inline-flex h-6 w-11 items-center transition-all focus:outline-none align-middle",
          RADIUS,
          // track colors (no border)
          checked ? "bg-neutral-900 dark:bg-white" : "bg-neutral-200 dark:bg-neutral-800",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        <span
          className={cx(
            "block h-5 w-5 rounded-lg bg-white dark:bg-neutral-950 transform transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
            "shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
          )}
        />
        {focusAura && focused && (
          <span
            aria-hidden
            className={cx(
              "pointer-events-none absolute -inset-0.5 -z-10 rounded-[inherit]",
              "bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.05),transparent_65%)]",
              "dark:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.07),transparent_65%)]"
            )}
          />
        )}
      </button>

      <div className="mt-1 min-h-[16px]">
        <div className={cx("font-inter leading-4", META)}>
          {error ? (
            <span id={`${id}-error`} className="text-red-500 font-medium">
              {error}
            </span>
          ) : hint ? (
            <span id={`${id}-hint`} className="text-neutral-500 dark:text-neutral-400">
              {hint}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}



/* -------------------------------- Checkbox -------------------------------- */

export interface CheckboxProps {
  id: string;
  /** Top label (keeps consistency with other fields) */
  label?: string;
  /** Helper text under the control */
  hint?: string;
  /** Error text under the control */
  error?: string;
  /** Wrapper <div> class */
  containerClassName?: string;

  /** Inline text shown to the right of the box (optional) */
  text?: string;

  checked?: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  /** Subtle focus halo on the box */
  focusAura?: boolean;
  /** Show indeterminate (dash) state */
  indeterminate?: boolean;
}

/**
 * Minimal, premium checkbox:
 * - Pixel-aligned 18×18 box
 * - Subtle focus aura
 * - Inline text and top label supported
 * - Full a11y via native <input type="checkbox">
 * - Design tokens: LABEL, META, TEXT should be defined in your system
 */
export function Checkbox({
  id,
  label,
  hint,
  error,
  containerClassName,
  text,
  checked = false,
  onChange,
  disabled,
  focusAura = true,
  indeterminate = false,
}: CheckboxProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [focused, setFocused] = React.useState(false);

  // keep native indeterminate in sync
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate && !checked;
    }
  }, [indeterminate, checked]);

  return (
    <div className={cx("w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={cx(
            "mb-1 block select-none font-medium font-inter tracking-tight text-neutral-700 dark:text-neutral-300",
            LABEL
          )}
        >
          {label}
        </label>
      )}

      <label
        htmlFor={id}
        className={cx(
          "inline-flex items-center gap-2 cursor-pointer select-none",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        {/* Native input (accessible) */}
        <input
          ref={inputRef}
          id={id}
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          onChange={(e) => onChange?.(e.target.checked)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        {/* Visual box (18×18) */}
        <span
          aria-hidden
          className={cx(
            "relative inline-grid h-[18px] w-[18px] place-items-center rounded-lg transition-colors",
            // base (unchecked)
            "bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700",
            // checked fill
            "peer-checked:bg-neutral-900 peer-checked:border-neutral-900",
            "dark:peer-checked:bg-white dark:peer-checked:border-white"
          )}
        >
          {/* Check / Dash icon */}
          <span className="pointer-events-none inline-flex items-center justify-center">
            {/* Check (when checked) */}
            <FaIcons.FaCheck
              size={12}
              className={cx(
                "opacity-0 peer-checked:opacity-100 transition-opacity",
                "text-white dark:text-neutral-900"
              )}
            />
            {/* Dash (when indeterminate true and not checked) */}
            <span
              className={cx(
                "absolute h-[2px] w-3 rounded-sm bg-neutral-900 dark:bg-white",
                indeterminate && !checked ? "opacity-100" : "opacity-0",
                "transition-opacity"
              )}
            />
          </span>

          {/* Focus aura */}
          {focusAura && focused && (
            <span
              aria-hidden
              className={cx(
                "pointer-events-none absolute -inset-1 -z-10 rounded-[10px]",
                "bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.06),transparent_65%)]",
                "dark:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.08),transparent_65%)]"
              )}
            />
          )}
        </span>

        {/* Inline text (optional) */}
        {text && <span className={cx("font-inter", TEXT)}>{text}</span>}
      </label>

      {/* Hint / Error */}
      <div className="mt-1 min-h-[16px]">
        <div className={cx("font-inter leading-4", META)}>
          {error ? (
            <span id={`${id}-error`} className="text-red-500 font-medium">
              {error}
            </span>
          ) : hint ? (
            <span id={`${id}-hint`} className="text-neutral-500 dark:text-neutral-400">
              {hint}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}


/* -------------------------------- SearchInput ------------------------------ */
/* -------------------------------- SearchInput ------------------------------ */
export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  /** Wrapper <div> class */
  containerClassName?: string;
  /** Subtle focus halo on wrapper */
  focusAura?: boolean;

  /** Icon support (consistent with CustomInput) */
  leadingIconName?: keyof typeof FaIcons | string;
  iconSize?: number;
  iconClassName?: string;

  /** Callbacks */
  onSearch?: (query: string) => void; // Enter triggers this
  onClear?: () => void;               // Clear button clicked
}

export function SearchInput({
  id,
  label,
  hint,
  error,
  containerClassName,
  className,
  disabled,
  focusAura = true,

  // icons
  leadingIconName = "FaSearch",
  iconSize = ICON_DEFAULT,
  iconClassName,

  // events
  onSearch,
  onClear,

  // standard input props
  onFocus,
  onBlur,
  onChange,
  value,
  defaultValue,
  placeholder = "Search…",
  ...props
}: SearchInputProps) {
  const [focused, setFocused] = React.useState(false);
  const [inner, setInner] = React.useState<string>(
    typeof defaultValue === "string"
      ? defaultValue
      : typeof value === "string"
      ? (value as string)
      : ""
  );

  // keep in sync when controlled
  React.useEffect(() => {
    if (typeof value === "string") setInner(value);
  }, [value]);

  const describedBy = React.useMemo(() => {
    const ids: string[] = [];
    if (error) ids.push(`${id}-error`);
    else if (hint) ids.push(`${id}-hint`);
    return ids.join(" ");
  }, [error, hint, id]);

  const LeadingIcon = React.useMemo(
    () => resolveFaIcon(leadingIconName, iconSize),
    [leadingIconName, iconSize]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch?.(inner);
  };

  const clear = () => {
    setInner("");
    onClear?.();
    // notify parent if they passed an onChange
    if (onChange) {
      const e = { target: { value: "" } } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange(e);
    }
  };

  return (
    <div className={cx("w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={cx(
            "mb-1 block select-none font-medium font-inter tracking-tight text-neutral-700 dark:text-neutral-300",
            LABEL
          )}
        >
          {label}
        </label>
      )}

      <div
        className={cx(
          "group relative isolate flex items-center",
          BASE_BG_TEXT, FRAME, RADIUS, PAD_Y, PAD_X, GAP,
          "transition-all duration-150 motion-reduce:transition-none",
          disabled && "opacity-60 cursor-not-allowed",
          focused ? cx(RING_FOCUS, ELEV_FOCUS) : ELEV_REST,
          className
        )}
      >
        {/* Leading icon slot (fixed 18×18 to prevent layout shift) */}
        {LeadingIcon && (
          <span
            aria-hidden
            className={cx(
              "inline-grid place-items-center w-[18px] h-[18px] text-neutral-500 dark:text-neutral-400",
              "group-focus-within:text-neutral-900 dark:group-focus-within:text-neutral-100 transition-colors",
              iconClassName
            )}
          >
            {LeadingIcon}
          </span>
        )}

        <input
          id={id}
          type="search"
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          disabled={disabled}
          value={inner}
          onChange={(e) => {
            setInner(e.target.value);
            onChange?.(e);
          }}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          placeholder={placeholder}
          className={cx(
            "peer w-full bg-transparent font-inter outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
            TEXT
          )}
          {...props}
        />

        {/* Trailing actions */}
        <div className="ml-1 -mr-1 flex items-center gap-1">
          {inner ? (
            <button
              type="button"
              onClick={clear}
              className={cx(
                META,
                "px-1.5 py-[3px] rounded-lg border border-neutral-200 dark:border-neutral-800",
                "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
              )}
              aria-label="Clear search"
            >
              Clear
            </button>
          ) : null}
        </div>

        {focusAura && focused && (
          <span
            aria-hidden
            className={cx(
              "pointer-events-none absolute -inset-0.5 -z-10 rounded-[inherit]",
              "bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.05),transparent_65%)]",
              "dark:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.07),transparent_65%)]"
            )}
          />
        )}
      </div>

      <div className="mt-1 min-h-[16px]">
        <div className={cx("font-inter leading-4", META)}>
          {error ? (
            <span id={`${id}-error`} className="text-red-500 font-medium">
              {error}
            </span>
          ) : hint ? (
            <span id={`${id}-hint`} className="text-neutral-500 dark:text-neutral-400">
              {hint}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- CopyableInput ----------------------------- */
export interface CopyableInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "onCopy"> {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  /** Wrapper <div> class */
  containerClassName?: string;
  /** Subtle focus halo */
  focusAura?: boolean;

  /** Icon support (consistent with CustomInput) */
  leadingIconName?: keyof typeof FaIcons | string;
  iconSize?: number;
  iconClassName?: string;

  /** Text to copy (uses `value` when present) */
  value: string | number;

  /** Called after successful copy */
  onCopy?: (copied: string) => void;

  /** Override button labels */
  copyLabel?: string;
  copiedLabel?: string;

  /** Readonly by default to prevent edits */
  readOnly?: boolean;
}

export function CopyableInput({
  id,
  label,
  hint,
  error,
  containerClassName,
  className,
  disabled,
  focusAura = true,

  // icon
  leadingIconName,
  iconSize = ICON_DEFAULT,
  iconClassName,

  // copy specifics
  value,
  onCopy,
  copyLabel = "Copy",
  copiedLabel = "Copied",

  // input props
  onFocus,
  onBlur,
  readOnly = true,
  ...props
}: CopyableInputProps) {
  const [focused, setFocused] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const LeadingIcon = React.useMemo(
    () => resolveFaIcon(leadingIconName, iconSize),
    [leadingIconName, iconSize]
  );

  const describedBy = React.useMemo(() => {
    const ids: string[] = [];
    if (error) ids.push(`${id}-error`);
    else if (hint) ids.push(`${id}-hint`);
    return ids.join(" ");
  }, [error, hint, id]);

  const doCopy = async () => {
    if (disabled) return;
    const text = String(value ?? "");
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      onCopy?.(text);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // no-op (optional: surface an error state)
    }
  };

  return (
    <div className={cx("w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={cx(
            "mb-1 block select-none font-medium font-inter tracking-tight text-neutral-700 dark:text-neutral-300",
            LABEL
          )}
        >
          {label}
        </label>
      )}

      <div
        className={cx(
          "group relative isolate flex items-center",
          BASE_BG_TEXT, FRAME, RADIUS, PAD_Y, PAD_X, GAP,
          "transition-all duration-150 motion-reduce:transition-none",
          disabled && "opacity-60 cursor-not-allowed",
          focused ? cx(RING_FOCUS, ELEV_FOCUS) : ELEV_REST,
          className
        )}
      >
        {LeadingIcon && (
          <span
            aria-hidden
            className={cx(
              "inline-grid place-items-center w-[18px] h-[18px] text-neutral-500 dark:text-neutral-400",
              "group-focus-within:text-neutral-900 dark:group-focus-within:text-neutral-100 transition-colors",
              iconClassName
            )}
          >
            {LeadingIcon}
          </span>
        )}

        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          disabled={disabled}
          readOnly={readOnly}
          value={String(value ?? "")}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={cx(
            "peer w-full bg-transparent font-inter outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
            TEXT
          )}
          {...props}
        />

        <div className="ml-1 -mr-1 flex items-center gap-1">
          <button
            type="button"
            onClick={doCopy}
            disabled={disabled}
            className={cx(
              META,
              "px-1.5 py-[3px] rounded-lg border border-neutral-200 dark:border-neutral-800",
              "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
            )}
            aria-live="polite"
            aria-label={copied ? copiedLabel : copyLabel}
          >
            {copied ? copiedLabel : copyLabel}
          </button>
        </div>

        {focusAura && focused && (
          <span
            aria-hidden
            className={cx(
              "pointer-events-none absolute -inset-0.5 -z-10 rounded-[inherit]",
              "bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.05),transparent_65%)]",
              "dark:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.07),transparent_65%)]"
            )}
          />
        )}
      </div>

      <div className="mt-1 min-h-[16px]">
        <div className={cx("font-inter leading-4", META)}>
          {error ? (
            <span id={`${id}-error`} className="text-red-500 font-medium">
              {error}
            </span>
          ) : hint ? (
            <span id={`${id}-hint`} className="text-neutral-500 dark:text-neutral-400">
              {hint}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}


/* ---------------------------------- OTPInput ------------------------------- */
/**
 * NOTE: This component expects your design tokens/utilities to be in scope:
 * cx, BASE_BG_TEXT, FRAME, RADIUS, ELEV_REST, ELEV_FOCUS, RING_FOCUS, LABEL, META, TEXT
 */

export interface OTPInputProps {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;

  /** Number of boxes */
  length?: number; // default 6

  /** Controlled value (optional) */
  value?: string;

  /** Uncontrolled initial value */
  defaultValue?: string;

  /** Called on any change with full string (<= length) */
  onChange?: (code: string) => void;

  /** Called once when all boxes are filled */
  onComplete?: (code: string) => void;

  /** Allow only digits 0–9 */
  numericOnly?: boolean; // default true

  disabled?: boolean;

  /** Subtle focus halo per box */
  focusAura?: boolean;

  /** Optional: tiny filled indicator in each cell (default false) */
  showFilledDot?: boolean;
}

export function OTPInput({
  id,
  label,
  hint,
  error,
  containerClassName,
  length = 6,
  value,
  defaultValue = "",
  onChange,
  onComplete,
  numericOnly = true,
  disabled,
  focusAura = true,
  showFilledDot = false,
}: OTPInputProps) {
  // Controlled vs. uncontrolled
  const isControlled = typeof value === "string";
  const [internal, setInternal] = React.useState(defaultValue.slice(0, length));
  const code = (isControlled ? value! : internal).slice(0, length);
  const chars = React.useMemo(
    () => Array.from({ length }, (_, i) => code[i] || ""),
    [code, length]
  );

  // Focus management
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);
  const setInputRef = React.useCallback(
    (idx: number) => (el: HTMLInputElement | null) => {
      inputsRef.current[idx] = el;
    },
    []
  );
  const focusBox = (idx: number) => inputsRef.current[idx]?.focus();

  // Clamp external controlled value if too long
  React.useEffect(() => {
    if (isControlled && value && value.length > length) {
      onChange?.(value.slice(0, length));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isControlled, value, length]);

  const describedBy = React.useMemo(() => {
    const ids: string[] = [];
    if (error) ids.push(`${id}-error`);
    else if (hint) ids.push(`${id}-hint`);
    return ids.join(" ");
  }, [error, hint, id]);

  const setCodeAt = (idx: number, ch: string) => {
    const nextChars = chars.slice();
    nextChars[idx] = ch;
    const next = nextChars.join("");
    if (!isControlled) setInternal(next);
    onChange?.(next);
    if (next.length === length && !next.includes("")) onComplete?.(next);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, idx: number) => {
    e.preventDefault();
    if (disabled) return;
    const text = (e.clipboardData.getData("text") || "").trim();
    const filtered = numericOnly ? text.replace(/\D/g, "") : text;
    if (!filtered) return;

    const nextChars = chars.slice();
    let k = 0;
    for (let i = idx; i < length && k < filtered.length; i++, k++) {
      nextChars[i] = filtered[k];
    }
    const next = nextChars.join("").slice(0, length);

    if (!isControlled) setInternal(next);
    onChange?.(next);

    const lastFilled = Math.min(idx + filtered.length - 1, length - 1);
    focusBox(Math.min(lastFilled + 1, length - 1));

    if (next.length === length && !next.includes("")) onComplete?.(next);
  };

  return (
    <div className={cx("w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={`${id}-0`}
          className={cx(
            "mb-1 block select-none font-medium font-inter tracking-tight text-neutral-700 dark:text-neutral-300",
            LABEL
          )}
        >
          {label}
        </label>
      )}

      {/* Boxes row */}
      <div className="flex items-center gap-2">
        {Array.from({ length }).map((_, i) => {
          const isFocused = focusedIndex === i;
          const filled = !!chars[i];

          return (
            <div
              key={i}
              className={cx(
                "group relative isolate",
                BASE_BG_TEXT,
                FRAME,
                RADIUS,
                "w-10 h-10", // compact square, matches your density
                "transition-all duration-150 motion-reduce:transition-none",
                disabled && "opacity-60",
                isFocused ? cx(RING_FOCUS, ELEV_FOCUS) : ELEV_REST
              )}
            >
              <input
                id={`${id}-${i}`}
                ref={setInputRef(i)}
                type="text"
                inputMode={numericOnly ? "numeric" : "text"}
                autoComplete="one-time-code"
                pattern={numericOnly ? "[0-9]*" : undefined}
                maxLength={1}
                disabled={disabled}
                aria-invalid={!!error}
                aria-describedby={describedBy || undefined}
                aria-label={`OTP character ${i + 1}`}
                value={chars[i] ?? ""}
                onFocus={() => setFocusedIndex(i)}
                onBlur={() => setFocusedIndex((prev) => (prev === i ? null : prev))}
                onPaste={(e) => handlePaste(e, i)}
                onChange={(e) => {
                  let v = e.target.value.slice(-1);
                  if (numericOnly) v = v.replace(/\D/g, "");
                  setCodeAt(i, v);
                  if (v && i < length - 1) focusBox(i + 1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace") {
                    if (!chars[i] && i > 0) {
                      focusBox(i - 1);
                      if (chars[i - 1]) setCodeAt(i - 1, "");
                    } else {
                      setCodeAt(i, "");
                    }
                  } else if (e.key === "ArrowLeft" && i > 0) {
                    e.preventDefault();
                    focusBox(i - 1);
                  } else if (e.key === "ArrowRight" && i < length - 1) {
                    e.preventDefault();
                    focusBox(i + 1);
                  }
                }}
                className={cx(
                  "w-full h-full bg-transparent text-center font-inter outline-none",
                  "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
                  TEXT,
                  "tabular-nums"
                )}
                placeholder="•" // only shows when empty
              />

              {focusAura && isFocused && (
                <span
                  aria-hidden
                  className={cx(
                    "pointer-events-none absolute -inset-0.5 -z-10 rounded-[inherit]",
                    "bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.05),transparent_65%)]",
                    "dark:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.07),transparent_65%)]"
                  )}
                />
              )}

              {showFilledDot && (
                <span
                  aria-hidden
                  className={cx(
                    "pointer-events-none absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full transition-opacity",
                    filled
                      ? "opacity-70 bg-neutral-900/50 dark:bg-neutral-100/60"
                      : "opacity-0"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Hint / Error */}
      <div className="mt-1 min-h-[16px]">
        <div className={cx("font-inter leading-4", META)}>
          {error ? (
            <span id={`${id}-error`} className="text-red-500 font-medium">
              {error}
            </span>
          ) : hint ? (
            <span id={`${id}-hint`} className="text-neutral-500 dark:text-neutral-400">
              {hint}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}


/* ---------------------------------- TagInput ------------------------------- */
/**
 * Minimal, premium tag entry with consistent tokens.
 * Expects these tokens/helpers in scope: cx, BASE_BG_TEXT, FRAME, RADIUS,
 * ELEV_REST, ELEV_FOCUS, RING_FOCUS, LABEL, META, TEXT, PAD_Y, PAD_X, GAP,
 * resolveFaIcon, ICON_DEFAULT (optional if you use leadingIconName).
 */

export interface TagInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "value" | "defaultValue" | "onChange"> {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;

  /** Controlled value (list of tags) */
  value?: string[];
  /** Uncontrolled initial tags */
  defaultValue?: string[];
  /** Change callback (entire tag list) */
  onChange?: (tags: string[]) => void;

  /** Placeholder for the text box */
  placeholder?: string;

  /** Max number of tags (optional) */
  maxTags?: number;
  /** Allow duplicate tags (default false) */
  allowDuplicates?: boolean;
  /** Lowercase all tags (default true) */
  lowercase?: boolean;
  /** Trim whitespace (default true) */
  trim?: boolean;
  /** Custom transform for each new tag (runs after trim/lowercase) */
  transformTag?: (t: string) => string;
  /** Validate a tag; return false to block */
  validateTag?: (t: string) => boolean;

  /** Keys that commit a tag (Enter, comma, Tab by default) */
  commitKeys?: Array<"Enter" | "," | "Tab" | " ">; // space optional

  /** Paste delimiter regex; default /[,\n]/ */
  pasteSplit?: RegExp;

  /** Disable interaction */
  disabled?: boolean;

  /** Subtle focus halo */
  focusAura?: boolean;

  /** Optional leading icon (react-icons/fa name) */
  leadingIconName?: keyof typeof FaIcons | string;
  iconSize?: number;
  iconClassName?: string;

  /** Max characters per tag (optional) */
  maxTagLength?: number;
}

export function TagInput({
  id,
  label,
  hint,
  error,
  containerClassName,
  className,

  value,
  defaultValue = [],
  onChange,

  placeholder = "Add tag…",

  maxTags,
  allowDuplicates = false,
  lowercase = true,
  trim = true,
  transformTag,
  validateTag,
  commitKeys = ["Enter", ",", "Tab"],
  pasteSplit = /[,\n]/,
  disabled,
  focusAura = true,

  leadingIconName,
  iconSize = ICON_DEFAULT,
  iconClassName,

  maxTagLength,

  ...inputProps
}: TagInputProps) {
  const isControlled = Array.isArray(value);
  const [innerTags, setInnerTags] = React.useState<string[]>(defaultValue);
  const tags = isControlled ? (value as string[]) : innerTags;

  const [text, setText] = React.useState("");
  const [focused, setFocused] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const LeadingIcon = React.useMemo(
    () => resolveFaIcon?.(leadingIconName as any, iconSize),
    [leadingIconName, iconSize]
  );

  const describedBy = React.useMemo(() => {
    const ids: string[] = [];
    if (error) ids.push(`${id}-error`);
    else if (hint) ids.push(`${id}-hint`);
    return ids.join(" ");
  }, [error, hint, id]);

  const commit = React.useCallback(
    (raw: string) => {
      let t = raw;
      if (trim) t = t.trim();
      if (!t) return;
      if (lowercase) t = t.toLowerCase();
      if (typeof maxTagLength === "number") t = t.slice(0, maxTagLength);
      if (transformTag) t = transformTag(t);

      if (!allowDuplicates && tags.includes(t)) return;
      if (typeof maxTags === "number" && tags.length >= maxTags) return;
      if (validateTag && !validateTag(t)) return;

      const next = [...tags, t];
      if (!isControlled) setInnerTags(next);
      onChange?.(next);
    },
    [allowDuplicates, isControlled, lowercase, maxTagLength, maxTags, tags, transformTag, trim, validateTag] as any
  );

  // NOTE: above dependency had a misspelled `lowerCase`. Replace with correct deps:
  // (This patch keeps code valid without re-typing the entire hook)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {}, [lowercase]);

  const removeAt = (idx: number) => {
    const next = tags.filter((_, i) => i !== idx);
    if (!isControlled) setInnerTags(next);
    onChange?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    // Commit on configured keys
    if (commitKeys.includes(e.key as any)) {
      e.preventDefault();
      if (text) {
        commit(text);
        setText("");
      }
      return;
    }

    // Backspace: delete last tag when input empty
    if (e.key === "Backspace" && !text && tags.length) {
      e.preventDefault();
      removeAt(tags.length - 1);
      return;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    const data = e.clipboardData.getData("text");
    if (!data) return;
    const pieces = data
      .split(pasteSplit)
      .map((p) => (trim ? p.trim() : p))
      .filter(Boolean);
    if (pieces.length <= 1) return; // let browser paste normal text if single chunk
    e.preventDefault();
    for (const p of pieces) {
      if (typeof maxTags === "number" && tags.length >= maxTags) break;
      commit(p);
    }
    setText("");
  };

  const canTypeMoreTags =
    typeof maxTags === "number" ? tags.length < maxTags : true;

  return (
    <div className={cx("w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={cx(
            "mb-1 block select-none font-medium font-inter tracking-tight text-neutral-700 dark:text-neutral-300",
            LABEL
          )}
        >
          {label}
        </label>
      )}

      {/* Field */}
      <div
        className={cx(
          "group relative isolate flex flex-wrap items-center",
          BASE_BG_TEXT, FRAME, RADIUS, PAD_Y, PAD_X, GAP,
          "transition-all duration-150 motion-reduce:transition-none",
          disabled && "opacity-60 cursor-not-allowed",
          focused ? cx(RING_FOCUS, ELEV_FOCUS) : ELEV_REST,
          className
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Leading icon (fixed 18×18) */}
        {LeadingIcon && (
          <span
            aria-hidden
            className={cx(
              "inline-grid place-items-center w-[18px] h-[18px] mr-1.5",
              "text-neutral-500 dark:text-neutral-400",
              "group-focus-within:text-neutral-900 dark:group-focus-within:text-neutral-100 transition-colors",
              iconClassName
            )}
          >
            {LeadingIcon}
          </span>
        )}

        {/* Tags */}
        {tags.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className={cx(
              "inline-flex items-center gap-1 rounded-lg",
              "px-2 py-[3px]",
              "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100",
              "text-[12px] leading-[18px] font-inter"
            )}
          >
            {t}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAt(i);
                }}
                className={cx(
                  "inline-flex h-4 w-4 items-center justify-center rounded-md",
                  "border border-transparent hover:border-neutral-300 dark:hover:border-neutral-600",
                  "hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60",
                  "text-neutral-600 dark:text-neutral-300"
                )}
                aria-label={`Remove ${t}`}
              >
                ×
              </button>
            )}
          </span>
        ))}

        {/* Text input */}
        <input
          id={id}
          ref={inputRef}
          type="text"
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          disabled={disabled || !canTypeMoreTags}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className={cx(
            "flex-1 min-w-[100px] bg-transparent font-inter outline-none",
            "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
            TEXT
          )}
          {...inputProps}
        />

        {focusAura && focused && (
          <span
            aria-hidden
            className={cx(
              "pointer-events-none absolute -inset-0.5 -z-10 rounded-[inherit]",
              "bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.05),transparent_65%)]",
              "dark:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.07),transparent_65%)]"
            )}
          />
        )}
      </div>

      {/* Meta row */}
      <div className="mt-1 min-h-[16px] flex items-center justify-between">
        <div className={cx("font-inter leading-4", META)}>
          {error ? (
            <span id={`${id}-error`} className="text-red-500 font-medium">
              {error}
            </span>
          ) : hint ? (
            <span id={`${id}-hint`} className="text-neutral-500 dark:text-neutral-400">
              {hint}
            </span>
          ) : null}
        </div>

        {/* Optional counter (tags/max) */}
        {typeof maxTags === "number" && (
          <span className={cx("font-inter text-neutral-500 tabular-nums", META)}>
            {tags.length}/{maxTags}
          </span>
        )}
      </div>
    </div>
  );
}



/* -------------------------------- JsonKVInput ------------------------------ */
/**
 * Expects tokens/utilities in scope:
 * cx, BASE_BG_TEXT, FRAME, RADIUS, ELEV_REST, ELEV_FOCUS, RING_FOCUS, LABEL, META, TEXT
 */

export interface JsonKVInputProps {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;

  /** Controlled value (object) */
  value?: Record<string, string>;
  /** Uncontrolled initial value */
  defaultValue?: Record<string, string>;
  /** Emits full object AFTER local rows update commits */
  onChange?: (obj: Record<string, string>) => void;

  keyPlaceholder?: string;
  valuePlaceholder?: string;

  /** Trim whitespace for keys/values on emit (default true) */
  trim?: boolean;

  disabled?: boolean;
  focusAura?: boolean;
}

type Row = { id: string; k: string; v: string };

/* Utils */
function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as any).randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}

function objectFromRows(rows: Row[], trim = true): Record<string, string> {
  const out: Record<string, string> = {};
  for (const r of rows) {
    const k = trim ? r.k.trim() : r.k;
    const v = trim ? r.v.trim() : r.v;
    if (!k) continue;
    out[k] = v; // last one wins if duplicate keys
  }
  return out;
}

function rowsFromObject(obj?: Record<string, string>): Row[] {
  const entries = obj ? Object.entries(obj) : [];
  if (entries.length === 0) return [{ id: uid(), k: "", v: "" }];
  return entries.map(([k, v]) => ({ id: uid(), k, v }));
}

/**
 * Reconcile external object -> rows while preserving existing row IDs when keys match.
 */
function reconcileRowsWithValue(
  external: Record<string, string> | undefined,
  prevRows: Row[]
): Row[] {
  const keyToId = new Map<string, string>();
  for (const r of prevRows) {
    if (r.k) keyToId.set(r.k, r.id);
  }
  const entries = external ? Object.entries(external) : [];
  if (entries.length === 0) return [{ id: uid(), k: "", v: "" }];

  return entries.map(([k, v]) => {
    const existingId = keyToId.get(k);
    return { id: existingId ?? uid(), k, v };
  });
}

export function JsonKVInput({
  id,
  label,
  hint,
  error,
  containerClassName,

  value,
  defaultValue,
  onChange,

  keyPlaceholder = "Key",
  valuePlaceholder = "Value",

  trim = true,

  disabled,
  focusAura = true,
}: JsonKVInputProps) {
  // --- Source of truth: local rows state ---
  const [rows, setRows] = React.useState<Row[]>(
    value !== undefined ? reconcileRowsWithValue(value, []) : rowsFromObject(defaultValue)
  );

  // Flag to know if the last rows change came from us (local edit) or from parent
  const localEditRef = React.useRef(false);

  // When parent sends a new `value`, reconcile into rows but keep stable IDs.
  const prevValueJson = React.useRef<string | undefined>(undefined);
  React.useEffect(() => {
    if (value === undefined) return; // uncontrolled; parent not driving
    const nextJson = JSON.stringify(value);
    if (nextJson !== prevValueJson.current) {
      prevValueJson.current = nextJson;
      // Only reconcile if this wasn’t our own local edit echoing back
      if (!localEditRef.current) {
        setRows((prev) => reconcileRowsWithValue(value, prev));
      }
      // reset the flag either way
      localEditRef.current = false;
    }
  }, [value]);

  // Emit to parent AFTER local rows change commits (prevents "update during render")
  React.useEffect(() => {
    if (!onChange) return;
    // Only emit when we initiated the change locally OR when uncontrolled
    if (value === undefined || localEditRef.current) {
      onChange(objectFromRows(rows, trim));
      localEditRef.current = false; // reset
    }
  }, [rows, onChange, trim, value]);

  // --- Mutations (mark as local, then setRows) ---
  const updateRow = (rid: string, patch: Partial<Row>) => {
    localEditRef.current = true;
    setRows((prev) => prev.map((r) => (r.id === rid ? { ...r, ...patch } : r)));
  };

  const addRow = () => {
    localEditRef.current = true;
    setRows((prev) => [...prev, { id: uid(), k: "", v: "" }]);
  };

  const removeRow = (rid: string) => {
    localEditRef.current = true;
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== rid);
      return next.length ? next : [{ id: uid(), k: "", v: "" }];
    });
  };

  // --- A11Y/meta ---
  const [focused, setFocused] = React.useState(false);
  const describedBy = React.useMemo(() => {
    const ids: string[] = [];
    if (error) ids.push(`${id}-error`);
    else if (hint) ids.push(`${id}-hint`);
    return ids.join(" ");
  }, [error, hint, id]);

  // --- Render ---
  return (
    <div className={cx("w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={`${id}-k-0`}
          className={cx(
            "mb-1 block select-none font-medium font-inter tracking-tight text-neutral-700 dark:text-neutral-300",
            LABEL
          )}
        >
          {label}
        </label>
      )}

      <div
        className={cx(
          "group relative isolate flex flex-col",
          BASE_BG_TEXT, FRAME, RADIUS, "p-2",
          "transition-all duration-150 motion-reduce:transition-none",
          disabled && "opacity-60 cursor-not-allowed",
          focused ? cx(RING_FOCUS, ELEV_FOCUS) : ELEV_REST
        )}
      >
        <div className="flex flex-col gap-2">
          {rows.map((r, idx) => (
            <div key={r.id} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
              {/* Key */}
              <div
                className={cx(
                  "flex items-center",
                  BASE_BG_TEXT, FRAME, RADIUS, "py-[7px] px-3",
                  "transition-all duration-150",
                  "focus-within:ring-2 focus-within:ring-neutral-900/12"
                )}
              >
                <input
                  id={`${id}-k-${idx}`}
                  aria-invalid={!!error}
                  aria-describedby={describedBy || undefined}
                  disabled={disabled}
                  placeholder={keyPlaceholder}
                  value={r.k}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onChange={(e) => updateRow(r.id, { k: e.target.value })}
                  className={cx(
                    "w-full bg-transparent font-inter outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
                    TEXT
                  )}
                />
              </div>

              {/* Value */}
              <div
                className={cx(
                  "flex items-center",
                  BASE_BG_TEXT, FRAME, RADIUS, "py-[7px] px-3",
                  "transition-all duration-150",
                  "focus-within:ring-2 focus-within:ring-neutral-900/12"
                )}
              >
                <input
                  id={`${id}-v-${idx}`}
                  aria-invalid={!!error}
                  aria-describedby={describedBy || undefined}
                  disabled={disabled}
                  placeholder={valuePlaceholder}
                  value={r.v}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onChange={(e) => updateRow(r.id, { v: e.target.value })}
                  className={cx(
                    "w-full bg-transparent font-inter outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
                    TEXT
                  )}
                />
              </div>

              {/* Row actions */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => removeRow(r.id)}
                  disabled={disabled}
                  className={cx(
                    META,
                    "px-2 py-[2px] rounded-lg border border-neutral-200 dark:border-neutral-800",
                    "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
                  )}
                  aria-label="Delete row"
                >
                  <FaIcons.FaTrash />
                </button>

                {idx === rows.length - 1 && (
                  <button
                    type="button"
                    onClick={addRow}
                    disabled={disabled}
                    className={cx(
                      META,
                      "px-2 py-[2px] rounded-lg border border-neutral-200 dark:border-neutral-800",
                      "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
                    )}
                    aria-label="Add row"
                  >
                    <FaIcons.FaPlus />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {focusAura && focused && (
          <span
            aria-hidden
            className={cx(
              "pointer-events-none absolute -inset-0.5 -z-10 rounded-[inherit]",
              "bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.05),transparent_65%)]",
              "dark:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.07),transparent_65%)]"
            )}
          />
        )}
      </div>

      {/* Meta row */}
      <div className="mt-1 min-h-[16px] flex items-center justify-between">
        <div className={cx("font-inter leading-4", META)}>
          {error ? (
            <span id={`${id}-error`} className="text-red-500 font-medium">
              {error}
            </span>
          ) : hint ? (
            <span id={`${id}-hint`} className="text-neutral-500 dark:text-neutral-400">
              {hint}
            </span>
          ) : null}
        </div>
        <span className={cx("font-inter text-neutral-500 tabular-nums", META)}>
          {Object.keys(objectFromRows(rows, trim)).length} keys
        </span>
      </div>
    </div>
  );
}
