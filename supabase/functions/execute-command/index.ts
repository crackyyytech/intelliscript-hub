import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const allowedCommands = [
  "npm",
  "yarn",
  "node",
  "tsc",
  "eslint",
  "prettier",
  "git",
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { command, projectId } = await req.json();

    if (!command) {
      return new Response(
        JSON.stringify({ error: "No command provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const commandParts = command.trim().split(/\s+/);
    const baseCommand = commandParts[0].toLowerCase();

    if (!allowedCommands.some((cmd) => baseCommand.includes(cmd))) {
      return new Response(
        JSON.stringify({
          error: "Command not allowed",
          allowedCommands,
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        result: `Command '${command}' executed successfully (simulated)`,
        exitCode: 0,
        success: true,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
        success: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});