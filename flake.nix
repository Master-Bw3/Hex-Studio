{
  description = "Hex Studio";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nix-gleam.url = "github:arnarg/nix-gleam";

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      nix-gleam,
    }:
    (flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [
            nix-gleam.overlays.default
          ];
        };
      in
      rec {
        packages = rec {
          hexStudio = pkgs.buildGleamApplication {
            src = ./.;
          };
          default = hexStudio;
        };

        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            gleam
            erlang
            nodejs
            bun
            rebar3
          ];
        };
      }
    ));
}