import { test, expect } from "@playwright/test";

test.describe("Handy App", () => {
  test("dev server responds", async ({ page }) => {
    // Just verify the dev server is running and responds
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("page has html structure", async ({ page }) => {
    await page.goto("/");

    // Verify basic HTML structure exists
    const html = await page.content();
    expect(html).toContain("<html");
    expect(html).toContain("<body");
  });
});

test("asr_initial_prompt_settings_show_promptv3_text", async ({ page }) => {
  await page.goto("/");

  await page.evaluate(async () => {
    const [React, ReactDom, settingsModule, storeModule, bindingsModule] =
      await Promise.all([
        import("/node_modules/.vite/deps/react.js"),
        import("/node_modules/.vite/deps/react-dom_client.js"),
        import("/src/components/settings/AsrInitialPrompt.tsx"),
        import("/src/stores/settingsStore.ts"),
        import("/src/bindings.ts"),
      ]);

    bindingsModule.commands.changeAsrPromptEnabledSetting = async () => ({
      status: "ok",
      data: null,
    });
    bindingsModule.commands.changeAsrInitialPromptSetting = async () => ({
      status: "ok",
      data: null,
    });

    const settings = {
      asr_prompt_enabled: true,
      asr_initial_prompt:
        "Расставляй пунктуацию в русской диктовке. Сохраняй английские IT-термины латиницей: GitHub, Claude Code, Cursor, OpenAI, API, JSON, TypeScript, JavaScript, Python, Rust, Tauri, React, macOS, Docker, Kubernetes, branch, commit, merge request, pull request, deploy, production, config.",
    };

    storeModule.useSettingsStore.setState({
      settings,
      defaultSettings: settings,
      isLoading: false,
      isUpdating: {},
      settingErrors: {},
    });

    document.body.innerHTML = '<div id="test-root"></div>';
    const createRoot = ReactDom.createRoot ?? ReactDom.default.createRoot;
    const createElement = React.createElement ?? React.default.createElement;
    createRoot(document.getElementById("test-root")).render(
      createElement(settingsModule.AsrInitialPrompt, {
        descriptionMode: "inline",
        grouped: true,
      }),
    );
  });

  await expect(page.getByText("ASR initial prompt")).toBeVisible();
  await expect(page.getByRole("checkbox")).toBeChecked();
  await expect(page.getByText("Initial prompt text")).toBeVisible();
  await expect(
    page.getByPlaceholder("Prompt used before/during ASR recognition"),
  ).toHaveValue(/Claude Code/);
});

test("post_processing_settings_show_capglue_unavailable_state", async ({
  page,
}) => {
  await page.goto("/");

  await page.evaluate(async () => {
    (window as any).__TAURI_OS_PLUGIN_INTERNALS__ = {
      platform: "linux",
      os_type: "linux",
      family: "unix",
      eol: "\n",
      version: "test",
      arch: "x86_64",
      exe_extension: "",
    };

    const [React, ReactDom, settingsModule, storeModule, bindingsModule] =
      await Promise.all([
        import("/node_modules/.vite/deps/react.js"),
        import("/node_modules/.vite/deps/react-dom_client.js"),
        import(
          "/src/components/settings/post-processing/PostProcessingSettings.tsx"
        ),
        import("/src/stores/settingsStore.ts"),
        import("/src/bindings.ts"),
      ]);

    bindingsModule.commands.changePasteMethodSetting = async () => ({
      status: "ok",
      data: null,
    });

    const settings = {
      bindings: {
        transcribe_with_post_process: {
          id: "transcribe_with_post_process",
          name: "Transcribe with Post Process",
          description: "Transcribe and refine",
          default_binding: "CmdOrCtrl+Shift+P",
          current_binding: "CmdOrCtrl+Shift+P",
        },
      },
      push_to_talk: false,
      audio_feedback: false,
      paste_method: "ctrl_v",
      external_script_path: null,
      capglue_settings: { target: "", command: "capglue", args: [] },
      post_process_enabled: true,
      post_process_provider_id: "openai",
      post_process_providers: [
        {
          id: "openai",
          label: "OpenAI",
          base_url: "https://api.openai.com/v1",
        },
      ],
      post_process_api_keys: {},
      post_process_models: { openai: "gpt-4o-mini" },
      post_process_prompts: [
        {
          id: "default_improve_transcriptions",
          name: "Improve Transcriptions",
          prompt: "Improve ${output}",
        },
      ],
      post_process_selected_prompt_id: "default_improve_transcriptions",
      experimental_enabled: true,
      keyboard_implementation: "tauri",
    };

    storeModule.useSettingsStore.setState({
      settings,
      defaultSettings: settings,
      isLoading: false,
      isUpdating: {},
      postProcessModelOptions: {},
      settingErrors: {},
    });

    document.body.innerHTML = '<div id="test-root"></div>';
    const createRoot = ReactDom.createRoot ?? ReactDom.default.createRoot;
    const createElement = React.createElement ?? React.default.createElement;
    createRoot(document.getElementById("test-root")).render(
      createElement(settingsModule.PostProcessingSettings),
    );
  });

  await expect(page.getByText("promptv3")).toHaveCount(0);

  await page.getByRole("button", { name: /Clipboard/ }).click();
  await page.getByRole("button", { name: "Capglue" }).click();
  await expect(
    page.getByText(/Capglue is selected but no target is configured yet/),
  ).toBeVisible();
  await expect(
    page.getByPlaceholder("Capglue target (required)"),
  ).toBeVisible();
});

test("post_processing_settings_show_capglue_paste_method_on_macos", async ({
  page,
}) => {
  await page.goto("/");

  await page.evaluate(async () => {
    (window as any).__TAURI_OS_PLUGIN_INTERNALS__ = {
      platform: "macos",
      os_type: "macos",
      family: "unix",
      eol: "\n",
      version: "test",
      arch: "aarch64",
      exe_extension: "",
    };

    const [React, ReactDom, settingsModule, storeModule, bindingsModule] =
      await Promise.all([
        import("/node_modules/.vite/deps/react.js"),
        import("/node_modules/.vite/deps/react-dom_client.js"),
        import(
          "/src/components/settings/post-processing/PostProcessingSettings.tsx"
        ),
        import("/src/stores/settingsStore.ts"),
        import("/src/bindings.ts"),
      ]);

    bindingsModule.commands.changePasteMethodSetting = async () => ({
      status: "ok",
      data: null,
    });

    const settings = {
      bindings: {},
      push_to_talk: false,
      audio_feedback: false,
      paste_method: "ctrl_v",
      external_script_path: null,
      capglue_settings: { target: "", command: "capglue", args: [] },
      post_process_enabled: true,
      post_process_provider_id: "openai",
      post_process_providers: [
        {
          id: "openai",
          label: "OpenAI",
          base_url: "https://api.openai.com/v1",
        },
      ],
      post_process_api_keys: {},
      post_process_models: { openai: "gpt-4o-mini" },
      post_process_prompts: [],
      post_process_selected_prompt_id: null,
      experimental_enabled: true,
      keyboard_implementation: "tauri",
    };

    storeModule.useSettingsStore.setState({
      settings,
      defaultSettings: settings,
      isLoading: false,
      isUpdating: {},
      postProcessModelOptions: {},
      settingErrors: {},
    });

    document.body.innerHTML = '<div id="test-root"></div>';
    const createRoot = ReactDom.createRoot ?? ReactDom.default.createRoot;
    const createElement = React.createElement ?? React.default.createElement;
    createRoot(document.getElementById("test-root")).render(
      createElement(settingsModule.PostProcessingSettings),
    );
  });

  await page.getByRole("button", { name: /Clipboard \(Cmd\+V\)/ }).click();
  await expect(page.getByRole("button", { name: "Capglue" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "External Script" }),
  ).toHaveCount(0);
});

test("capglue_invalid_save_rolls_back_and_exposes_error", async ({ page }) => {
  await page.goto("/");

  const result = await page.evaluate(async () => {
    const [{ commands }, { useSettingsStore }] = await Promise.all([
      import("/src/bindings.ts"),
      import("/src/stores/settingsStore.ts"),
    ]);

    const persistedSettings = {
      capglue_settings: {
        target: "com.persisted.Target",
        command: "capglue",
        args: [],
      },
    };

    commands.getAppSettings = async () => ({
      status: "ok",
      data: persistedSettings,
    });
    commands.changeCapglueSettingsSetting = async () => ({
      status: "error",
      error: "capglue target is required",
    });

    useSettingsStore.setState({
      settings: persistedSettings,
      defaultSettings: persistedSettings,
      isLoading: false,
      isUpdating: {},
    });

    await useSettingsStore.getState().updateSetting("capglue_settings", {
      target: "",
      command: "capglue",
      args: [],
    });

    return {
      capglueSettings: useSettingsStore.getState().settings?.capglue_settings,
      error: useSettingsStore.getState().getSettingError("capglue_settings"),
    };
  });

  expect(result.capglueSettings).toEqual({
    target: "com.persisted.Target",
    command: "capglue",
    args: [],
  });
  expect(result.error).toContain("capglue target is required");
});
