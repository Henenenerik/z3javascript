#!/bin/bash -e
./scripts/build_z3.sh
./scripts/build_bindings.sh
./scripts/build_em_bindings.sh
./scripts/build_ref_bindings.sh
./scripts/compile_to_es5.sh