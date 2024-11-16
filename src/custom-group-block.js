import { createHigherOrderComponent } from "@wordpress/compose";
import { Fragment } from "@wordpress/element";
import { InspectorControls } from "@wordpress/block-editor";
import {
  PanelBody,
  TextControl,
  Button,
  SelectControl,
} from "@wordpress/components";
import { addFilter } from "@wordpress/hooks";

// Available dynamic values
const DYNAMIC_VALUES = [
  { label: "Post/Page Permalink", value: "{{post_permalink}}" },
  { label: "Post/Page Title", value: "{{post_title}}" },
  { label: "Post/Page ID", value: "{{post_id}}" },
  { label: "Author Name", value: "{{author_name}}" },
  { label: "Current Date", value: "{{current_date}}" },
];

function addCustomAttribute(settings, name) {
  if (name !== "core/group") {
    return settings;
  }

  return {
    ...settings,
    attributes: {
      ...settings.attributes,
      dataAttributes: {
        type: "array",
        default: [],
      },
      customId: {
        type: "string",
        default: "",
      },
    },
  };
}

addFilter(
  "blocks.registerBlockType",
  "custom-attributes/custom-group-block",
  addCustomAttribute
);

const withInspectorControls = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    if (props.name !== "core/group") {
      return <BlockEdit {...props} />;
    }

    const { attributes, setAttributes } = props;
    const { dataAttributes, customId } = attributes;

    const addNewAttribute = () => {
      setAttributes({
        dataAttributes: [
          ...dataAttributes,
          { name: "", value: "", isDynamic: false },
        ],
      });
    };

    const updateAttribute = (index, key, value) => {
      const newAttributes = [...dataAttributes];
      newAttributes[index] = {
        ...newAttributes[index],
        [key]: value,
      };
      setAttributes({ dataAttributes: newAttributes });
    };

    const insertDynamicValue = (index, dynamicValue) => {
      const currentValue = dataAttributes[index].value;
      updateAttribute(index, "value", currentValue + dynamicValue);
    };

    const removeAttribute = (index) => {
      const newAttributes = dataAttributes.filter((_, i) => i !== index);
      setAttributes({ dataAttributes: newAttributes });
    };

    return (
      <Fragment>
        <BlockEdit {...props} />
        <InspectorControls>
          <PanelBody title="Custom HTML Attributes" initialOpen={false}>
            <div className="custom-attributes-panel">
              {dataAttributes.map((attr, index) => (
                <div
                  key={index}
                  className="custom-attribute-row"
                  style={{
                    marginBottom: "20px",
                    padding: "10px",
                    border: "1px solid #ddd",
                  }}
                >
                  <TextControl
                    label="Attribute Name"
                    value={attr.name}
                    onChange={(value) => updateAttribute(index, "name", value)}
                    style={{ marginBottom: "5px" }}
                  />
                  <TextControl
                    label="Attribute Value"
                    value={attr.value}
                    onChange={(value) => updateAttribute(index, "value", value)}
                  />
                  <SelectControl
                    label="Insert Dynamic Value"
                    value=""
                    options={[
                      { label: "Select...", value: "" },
                      ...DYNAMIC_VALUES,
                    ]}
                    onChange={(value) => {
                      if (value) {
                        insertDynamicValue(index, value);
                      }
                    }}
                  />
                  <Button
                    isDestructive
                    onClick={() => removeAttribute(index)}
                    variant="secondary"
                    style={{ marginTop: "5px" }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="secondary"
                onClick={addNewAttribute}
                style={{ marginTop: "10px" }}
              >
                Add Attribute
              </Button>
            </div>
            <TextControl
              label="Custom ID"
              help="Enter a unique identifier"
              value={customId}
              onChange={(value) => setAttributes({ customId: value })}
            />
          </PanelBody>
        </InspectorControls>
      </Fragment>
    );
  };
}, "withInspectorControls");

addFilter(
  "editor.BlockEdit",
  "custom-attributes/with-inspector-controls",
  withInspectorControls
);

function addCustomAttributesToSave(extraProps, blockType, attributes) {
  if (blockType.name !== "core/group") {
    return extraProps;
  }

  const { dataAttributes, customId } = attributes;

  // Add data attributes
  dataAttributes.forEach((attr) => {
    if (attr.name && attr.value) {
      const attrName = attr.name.trim();
      const attrValue = attr.value.trim();
      extraProps[attrName] = attrValue;
    }
  });

  // Add custom ID
  if (customId) {
    extraProps.id = customId;
  }

  return extraProps;
}

addFilter(
  "blocks.getSaveContent.extraProps",
  "custom-attributes/add-custom-attributes",
  addCustomAttributesToSave
);
