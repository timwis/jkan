# Schema Customization

Out of the box, JKAN comes with a few common fields for datasets, such as `title`, `organization`, `maintainer`, etc. You can add additional fields through the use of a schema file.

1. Create a new file in the `_data/schemas/` directory called `<your_schema>.yml`, ex. `chicago.yml`
2. Using `_data/schemas/default.yml` as a starting point, add fields to the `dataset_fields` and `resource_fields` sections
3. Change the `schema` setting in `_config.yml` to the name of your new schema (without the `.yml` extension), ex. `schema: chicago`

## Configuration
| Property | Description |
| --- | --- |
| `field_name` | The name of the field that gets put into the dataset file in the `_datasets/` directory |
| `label` | The human-readable label that is printed on the form |
| `placeholder` | An optional placeholder value. Defaults to the `label` |
| `display_template` | Optional path to template used on dataset display page, which gets passed the `field` object, a `field_name` string and a `value` string. See `_includes/display/` directory for examples. |
| `datajson` | Optional corresponding [data.json](https://project-open-data.cio.gov/v1.1/schema/) property, written in dot notation (ex. `contactPoint.fn`) |
| `values` | For fields that use the `form/dropdown.html` form template, a list of values |

Any additional properties will be passed to the display templates in the `field` object, so fields are pretty extensible.

## System fields
Your schema file should always include the below system fields. You can set their `label`, etc. to whatever you like, but keep their `field_name` as follows so JKAN's core functionality will still work.

**Dataset Fields**
* `title`
* `organization`
* `notes`
* `category`

**Resource Fields**
* `name`
* `url`
* `format`