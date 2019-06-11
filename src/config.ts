import ParagraphInput from "./BaseComponents/ParagraphInput";
import Paragraph from "./BaseComponents/Paragraph";
import { EditorState } from "draft-js";
import StringInput from "./BaseComponents/StringInput";
import BooleanInput from "./BaseComponents/BooleanInput";
import makeDropdownInput from "./BaseComponents/DropdownInput";

// Reworked components
import BlockSection from "./Templates/BlockSection";
import CardGroup from "./Templates/CardGroup";
import Column from "./Templates/Column";
import Columns from "./Templates/Columns";
import Text from "./Templates/Text";
import Image from "./Templates/Image";
import Table from "./Templates/Table/Table";
import TableRow from "./Templates/Table/TableRow";
import TableColumn from "./Templates/Table/TableColumn"

import { ConfigStructure } from "./types";

const paragraphInput = {
  // defaultValue: EditorState.createEmpty(),
  render: ParagraphInput,
  toJSON: () => {},
  fromJSON: () => {}
}

const config = {
  componentStructures: [
    // Start reworked components
    {
      id: 'blockSection',
      component: BlockSection,
      name: 'Section',
      propertyTypes: {
        title: StringInput,
        mode: makeDropdownInput(["banner", "section", "subsection", "accordion"]),
        children: 'any'
      },
      defaultValues: {
        title: 'hello world',
        mode: 'banner',
        children: []
      }
    },
    {
      id: 'cardGroup',
      component: CardGroup,
      name: 'Card Group',
      propertyTypes: {
        children: 'any'
      },
      defaultValues: {
        children: []
      }
    },
    {
      id: 'column',
      component: Column,
      name: 'Column',
      propertyTypes: {
        children: 'any'
      },
      defaultValues: {
        children: []
      }
    },
    {
      id: 'columns',
      component: Columns,
      name: 'Column Layout',
      propertyTypes: {
        children: 'any'
      },
      defaultValues: {
        children: []
      }
    },
    {
      id: 'text',
      component: Text,
      name: 'Text Area',
      propertyTypes: {
        text: ParagraphInput
      },
      defaultValues: {
        text: EditorState.createEmpty()
      }
    },
    {
      id: 'image',
      component: Image,
      name: 'Image',
      propertyTypes: {
        url: StringInput
      },
      defaultValues: {
        url: 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
      }
    },
    {
      id: 'text-table',
      component: Table,
      name: 'Text Table',
      propertyTypes: {
        title: StringInput,
        children: {
          custom: [
            {
              id: 'table-row',
              name: 'Row',
              component: TableRow,
              propertyTypes: {
                title: StringInput,
                children: {
                  custom: [
                    {
                      id: 'table-col',
                      name: 'Column',
                      component: TableColumn,
                      propertyTypes: {
                        content: ParagraphInput
                      },
                      defaultValues: {
                        content: EditorState.createEmpty()
                      }
                    }
                  ]
                }
              },
              defaultValues: {
                title: 'Row',
                children: []
              }
            }
          ]
        }
      },
      defaultValues: {
        title: 'hello world',
        children: []
      }
    }

    // {
    //   id: 'ribbon',
    //   component: Ribbon,
    //   name: 'Ribbon',
    //   propertyTypes: {
    //     children: 'string'
    //   }
    // },
    // {
    //   id: 'ribbon-card',
    //   component: RibbonCard,
    //   name: 'Ribbon Card',
    //   propertyTypes: {
    //     title: 'string',
    //     children: 'component'
    //   }
    // },
    // {
    //   id: 'small-ribbon-card',
    //   component: SmallRibbonCard,
    //   name: 'Small Ribbon Card',
    //   propertyTypes: {
    //     title: 'string',
    //     children: 'component'
    //   }
    // },
    // {
    //   id: 'basic-card',
    //   component: Card,
    //   name: 'Basic Card',
    //   propertyTypes: {
    //     children: {
    //       allowed: ['Paragraph', 'Check List']
    //     }
    //   }
    // },
    // {
    //   id: 'image-card',
    //   component: ImageCard,
    //   name: 'Image Card',
    //   propertyTypes: {
    //     url: 'string',
    //     children: 'string'
    //   }
    // },
    // {
    //   id: 'title-card',
    //   component: TitleCard,
    //   name: 'Title Card',
    //   propertyTypes: {
    //     title: 'string',
    //     children: 'string'
    //   }
    // },
    // {
    //   id: 'accordion-card',
    //   component: AccordionCard,
    //   name: 'Accordion Card',
    //   propertyTypes: {
    //     dropdown: 'boolean',
    //     title: 'string',
    //     children: 'string'
    //   }
    // },
    // {
    //   component: AccordionStackItem,
    //   name: 'Accordion Stack Item',
    //   propertyTypes: {
    //     title: 'string',
    //     children: 'component'
    //   }
    // },
    // {
    //   component: CheckList,
    //   name: 'Check List',
    //   propertyTypes: {
    //     children: {
    //       custom: [
    //         {
    //           id: 'check-list-summary',
    //           component: CheckListSummary,
    //           name: 'Check List Summary',
    //           propertyTypes: {
    //             children: 'paragraph'
    //           }
    //         },
    //         {
    //           id: 'check-list-criteria',
    //           component: CheckListCriteria,
    //           name: 'Check List Criteria',
    //           propertyTypes: {
    //             children: {
    //               custom: [
    //                 {
    //                   id: 'check-list-item',
    //                   component: CheckListItem,
    //                   name: 'Check List Item',
    //                   propertyTypes: {
    //                     children: 'string'
    //                   }
    //                 }
    //               ]
    //             }
    //           }
    //         }
    //       ]
    //     }
    //   }
    // },
    // {
    //   id: 'section-card',
    //   component: SectionCard,
    //   name: 'Section',
    //   propertyTypes: {
    //     title: 'string',
    //     children: {
    //       custom: [
    //         {
    //           id: 'main-banner',
    //           component: SectionMainBanner,
    //           name: 'Main Banner',
    //           propertyTypes: {
    //             children: 'string'
    //           }
    //         },
    //         {
    //           id: 'section-subbanner',
    //           component: SectionSubBanner,
    //           name: 'Section Sub Banner',
    //           propertyTypes: {
    //             children: 'string',
    //           }
    //         }
    //       ]
    //     }
    //   }
    // },
    // {
    //   id: 'link',
    //   component: Link,
    //   name: 'Link',
    //   propertyTypes: {
    //     url: 'string',
    //     red: 'boolean',
    //     children: 'string'
    //   }
    // },
    // {
    //   id: 'table',
    //   component: Table,
    //   name: 'Table',
    //   propertyTypes: {
    //     title: 'string',
    //     children: {
    //       custom: [
    //         {
    //           id: 'table-row',
    //           component: TableRow,
    //           name: 'Row',
    //           propertyTypes: {
    //             title: 'string',
    //             children: {
    //               custom: [
    //                 {
    //                   id: 'table-column',
    //                   component: TableColumn,
    //                   name: 'Column',
    //                   propertyTypes: {
    //                     children: 'string'
    //                   }
    //                 }
    //               ]
    //             }
    //           }
    //         }
    //       ]
    //     }
    //   }
    // }
  ] as ConfigStructure[]
}

export default config;
