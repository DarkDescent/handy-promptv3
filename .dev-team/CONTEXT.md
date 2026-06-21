# Dev Team KB — handy

Upstream: https://github.com/cjpais/Handy.git
Fork target: https://github.com/DarkDescent/handy-promptv3
Initial product request: add promptv3 and capglue support for the Handy open-source voice/tts project.

Per-feature lessons accreted by dt-devops on each merge. One bullet per shipped feature.
- 2026-06-20 handy-8651 handy: Added built-in promptv3 + capglue support in Handy post-processing flow with explicit UI error handling instead of silent fallback. Lesson: 2026-06-20T11:07:08Z: generator repair + real UI verification closed prompt/store drift before ship.
- 2026-06-21 handy-a840 handy: Hotfix for legacy prompt selection compile error in settings defaults. Lesson: 2026-06-21T19:16:50Z: hotfix branches for desktop repo still need fresh-main rebase + frontend toolchain restore before QA/build verdict..
