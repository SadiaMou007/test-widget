import React, { ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { useForm, SubmitHandler } from "react-hook-form";

export type InitOptions = { apiBaseUrl: string; authToken?: string };

const runtimeState: InitOptions = { apiBaseUrl: "", authToken: undefined };

export function init(options: InitOptions): void {
  runtimeState.apiBaseUrl = options.apiBaseUrl;
  runtimeState.authToken = options.authToken;
}

export async function requestJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${runtimeState.apiBaseUrl}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(runtimeState.authToken
      ? { Authorization: `Bearer ${runtimeState.authToken}` }
      : {}),
    ...(init?.headers as any),
  };
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export function mountReact(target: HTMLElement, element: ReactElement): void {
  const root = createRoot(target);
  root.render(element);
}

type SimpleListProps<T> = {
  endpoint: string;
  renderItem?: (item: T, idx: number) => ReactElement;
};

export function SimpleList<T>({
  endpoint,
  renderItem,
}: SimpleListProps<T>): ReactElement {
  const [data, setData] = React.useState<T[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    requestJson<T[]>(endpoint)
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e: any) => active && setError(e?.message || "Failed to load"));
    return () => {
      active = false;
    };
  }, [endpoint]);

  if (error) return <div role="alert">{error}</div>;
  if (!data) return <div>Loading…</div>;
  return (
    <ul>
      {data.map((item, idx) => (
        <li key={idx}>
          {renderItem ? (
            renderItem(item, idx)
          ) : (
            <pre>{JSON.stringify(item)}</pre>
          )}
        </li>
      ))}
    </ul>
  );
}

type FormFields = Record<string, any>;

export type SimpleFormProps<
  TFields extends FormFields = FormFields,
  TResult = unknown
> = {
  action: string;
  method?: "POST" | "PUT" | "PATCH";
  onSuccess?: (result: TResult) => void;
  className?: string;
};

export function SimpleForm<
  TFields extends FormFields = FormFields,
  TResult = unknown
>({
  action,
  method = "POST",
  onSuccess,
  className,
}: SimpleFormProps<TFields, TResult>): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TFields>();

  const onSubmit: SubmitHandler<TFields> = async (values) => {
    const result = await requestJson<TResult>(action, {
      method,
      body: JSON.stringify(values),
    });
    onSuccess?.(result);
  };

  return (
    <form className={className} onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("email" as any, { required: true })}
        type="email"
        placeholder="Email"
      />
      {errors?.["email" as keyof TFields] && <span>Email is required</span>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}

export const DMWidgets = {
  init,
  requestJson,
  mountReact,
  SimpleList,
  SimpleForm,
};

export default DMWidgets;
